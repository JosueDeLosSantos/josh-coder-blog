"use server";

import { signIn, signOut, auth } from "@/auth";
import { v4 as uuidv4 } from "uuid";
import { AuthError, Session } from "next-auth";
import { redirect } from "next/navigation";
import {
  SignupFormSchema,
  UpdateProfileSchema,
  UpdatePasswordSchema,
  FormState,
} from "@/lib/definitions";
import bcrypt from "bcryptjs";
import { db } from "@vercel/postgres";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export async function signup(prevState: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    firstName: formData.get("firstName"),
    surname: formData.get("surname"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  // Prepare data for insertion into database
  const { firstName, surname, email, password } = validatedFields.data;
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // call the db to create the user
  const client = await db.connect();
  // creates a user's table if it does not exist
  await client.query(
    `CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      firstname VARCHAR(255) NOT NULL,
      surname VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      bio TEXT NULL,
      image TEXT,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`
  );
  // check if there is a user with the same email
  const user = await client.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (!user.rows.length) {
    // insert the user into the database
    await client.query(
      `INSERT INTO users (name, firstName, surname, email, password) VALUES ($1, $2, $3, $4, $5)`,
      [`${firstName} ${surname}`, firstName, surname, email, hashedPassword]
    );
  } else {
    // show error
    return {
      errors: {
        email: ["Email already exists"],
      },
    };
  }

  // close the connection
  client.release();

  // Redirect the user to the sign in page
  redirect("/login");
}

export async function updatePassword(prevState: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = UpdatePasswordSchema.safeParse({
    password: formData.get("password"),
    new_password: formData.get("new_password"),
  });

  if (!validatedFields.success) {
    const customErrors = validatedFields.error.flatten().fieldErrors;
    if (customErrors.password) {
      customErrors.password = ["this is not your current password"];
    }
    return {
      errors: customErrors,
    };
  }

  const { password, new_password } = validatedFields.data;
  // e.g. check the user's password before updating it
  const client = await db.connect();
  const session = await auth();
  const user = await client.query(`SELECT * FROM users WHERE email = $1`, [
    session?.user?.email,
  ]);
  const isMatch = await bcrypt.compare(password, user.rows[0].password);
  if (isMatch) {
    const hashedPassword = await bcrypt.hash(new_password, 10);
    // update the user's password in the database
    await client.query(`UPDATE users SET password = $1 WHERE email = $2`, [
      hashedPassword,
      session?.user?.email,
    ]);
  } else {
    return { errors: { password: ["this is not your current password"] } };
  }
  // close the connection
  client.release();

  await signOut();
  // Redirect the user to the sign in page
  redirect("/login");
}

export async function updateProfile(prevState: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = UpdateProfileSchema.safeParse({
    firstName: formData.get("firstName"),
    surname: formData.get("surname"),
    email: formData.get("email"),
    bio: formData.get("bio"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  // Prepare data for insertion into database
  const { firstName, surname, email, bio } = validatedFields.data;

  const client = await db.connect();
  // check in the db if there is a user with the same email
  const user = await client.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  // check if email is different from the session email
  const session = await auth();
  const isSessionEmail = session?.user?.email === email;

  // if the email is different from the session email and is not found in the db
  if (!isSessionEmail && !user.rows.length) {
    // update the user's profile in the database
    await client.query(
      `UPDATE users SET name = $1, firstname = $2, surname = $3, email = $4, bio=$5 WHERE email = $6`,
      [
        `${firstName} ${surname}`,
        firstName,
        surname,
        email,
        bio,
        session?.user?.email,
      ]
    );
    client.release();

    await signOut();
    // Redirect the user to the sign in page
    redirect("/login");
    // if the email is different from the session email and is found in the db
  } else if (!isSessionEmail && user.rows.length) {
    // show error
    client.release();
    return {
      errors: {
        email: [`${email} belongs to another user`],
      },
    };
    // if the email is the same as the session email
  } else {
    // update the user's profile in the database
    await client.query(
      `UPDATE users SET name = $1, firstname = $2, surname = $3, bio = $4 WHERE email = $5`,
      [`${firstName} ${surname}`, firstName, surname, bio, email]
    );
    client.release();

    await signOut();
    // Redirect the user to the sign in page
    redirect("/login");
  }
}

export async function submitComment(FormData: FormData) {
  const comment = FormData.get("comment");
  const email = FormData.get("email");
  const client = await db.connect();
  const user = await client.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  // creates a user's table if it does not exist
  await client.query(
    `CREATE TABLE IF NOT EXISTS comments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now(),
      user_id UUID NOT NULL,
      parent_id UUID NULL,
      CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
    )`
  );
  // await client.query(
  //   `CREATE TABLE IF NOT EXISTS comments (
  //     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  //     message TEXT NOT NULL,
  //     created_at TIMESTAMPTZ DEFAULT now(),
  //     updated_at TIMESTAMPTZ DEFAULT now(),
  //     user_id UUID NOT NULL,
  //     post_id UUID NOT NULL,
  //     parent_id UUID NULL,
  //     CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  //     CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  //     CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
  //   )`
  // );

  // insert the comment into the database
  await client.query(
    `INSERT INTO comments (message, user_id) VALUES ($1, $2)`,
    [comment, user.rows[0].id]
  );

  // close the connection
  client.release();
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/blog" });
}

// Upload file using standard upload
export async function uploadFile(file: File) {
  const session = await auth();
  const pgClient = await db.connect();
  const user = await pgClient.query(`SELECT * FROM users WHERE email = $1`, [
    session?.user?.email,
  ]);
  const filePath = `joshcoderblog/${user.rows[0].id}${file.name}`;
  // upload the file
  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file);

  if (error) {
    console.log(error);
  } else {
    if (user.rows[0].image) {
      // delete the file from supabase
      await supabase.storage.from("avatars").remove([user.rows[0].image]);
    }
    // save the new file path to the database
    await pgClient.query(`UPDATE users SET image = $1 WHERE email = $2`, [
      filePath,
      session?.user?.email,
    ]);

    pgClient.release();

    return data;
  }
}

export async function getUrl(session: Session | null) {
  const pgClient = await db.connect();
  if (session) {
    const user = await pgClient.query(`SELECT * FROM users WHERE email = $1`, [
      session?.user?.email,
    ]);
    // check if there is a file path in the database
    if (user.rows[0].image) {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(user.rows[0].image);

      pgClient.release();
      return data.publicUrl;
    } else {
      // if there is no file path, return the default image
      pgClient.release();
      return "/profile.png";
    }
  } else {
    pgClient.release();
    return "/profile.png";
  }
}

export async function getUserData() {
  const session = await auth();
  const pgClient = await db.connect();
  const user = await pgClient.query(`SELECT * FROM users WHERE email = $1`, [
    session?.user?.email,
  ]);
  pgClient.release();
  // return the user object
  return user.rows[0];
}

// Upload file automatically
export async function uploadFileAuto() {
  const imagePath = "https://josh-coder-blog.vercel.app/profile.png"; // Path relative to /public
  const response = await fetch(imagePath);
  if (response.ok) {
    const blob = await response.blob(); // Convert to Blob
    const file = new File([blob], "profile.png", { type: blob.type });
    const filePath = "joshcoderblog/profile.png";
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);
    if (error) {
      console.log(error);
    } else {
      console.log("File uploaded successfully", data);
    }
  }
}

// Delete file automatically
export async function deleteFileAuto() {
  const { data } = await supabase.storage
    .from("avatars")
    .remove(["joshcoderblog/profile.png"]);
  console.log("File deleted successfully", data);
}
