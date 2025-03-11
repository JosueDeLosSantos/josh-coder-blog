"use server";

import { signIn, signOut, auth } from "@/auth";
import { v4 as uuidv4 } from "uuid";
import { AuthError, Session } from "next-auth";
import { redirect } from "next/navigation";
import { SignupFormSchema, FormState } from "@/lib/definitions";
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
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      firstName VARCHAR(255) NOT NULL,
      surname VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      bio TEXT,
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
  const filePath = `joshcoderblog/${uuidv4()}${file.name}`;
  // upload the file
  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file);

  if (error) {
    console.log(error);
  } else {
    // check if there is a file path in the database
    const user = await pgClient.query(`SELECT * FROM users WHERE email = $1`, [
      session?.user?.email,
    ]);

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
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(user.rows[0].image);
    pgClient.release();
    return data.publicUrl;
  } else {
    return null;
  }
}

export async function getTempUrl(path: string) {
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return { src: data.publicUrl, date: Date.now() };
}

// export async function deleteFile(path: string) {
//   const { data } = await supabase.storage.from("avatars").remove([path]);
//   return data;
// }
