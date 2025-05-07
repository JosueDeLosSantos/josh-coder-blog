"use server";

import { signIn, signOut, auth } from "@/auth";
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
import { PostType } from "@/app/types";
import { Message, ReadingListType } from "@/lib/definitions";

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

  const client = await db.connect();
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

  const callbackUrl = formData.get("redirectTo");

  // Redirect the user to the sign in page
  redirect(`${callbackUrl}`);
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
    if (
      firstName === user.rows[0].firstname &&
      surname === user.rows[0].surname
    ) {
      // update the user's profile in the database
      await client.query(`UPDATE users SET bio = $1 WHERE email = $2`, [
        bio,
        email,
      ]);
      client.release();

      // Redirect the user to the sign in page
      redirect("/auth/blog/profile");
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
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  const callbackUrl = formData.get("redirectTo");

  try {
    await signIn("credentials", formData, { redirect: callbackUrl as string });
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

export async function logout(v: string) {
  switch (v) {
    case "blog":
      await signOut({ redirectTo: "/blog" });
      break;
    case "profile":
      await signOut({ redirectTo: "/blog" });
      break;
    case "edit":
      await signOut({ redirectTo: "/blog" });
      break;
    case "password":
      await signOut({ redirectTo: "/blog" });
      break;
    case "bookmarks":
      await signOut({ redirectTo: "/blog" });
      break;
    default:
      await signOut({ redirectTo: `/blog/${v}` });
      break;
  }
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

export async function getImageUrl(
  session: Session | null,
  userImage?: string | null
) {
  if (session) {
    const pClient = await db.connect();
    const user = await pClient.query(`SELECT * FROM users WHERE email = $1`, [
      session?.user?.email,
    ]);
    pClient.release();
    const userProfileImage = user.rows[0]?.image;
    if (!userProfileImage) {
      return "/profile.png";
    } else {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(userProfileImage);
      return data.publicUrl;
    }
  } else if (!session && userImage && userImage !== "/profile.png") {
    const { data } = supabase.storage.from("avatars").getPublicUrl(userImage);
    return data.publicUrl;
  } else {
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

// Posts

export async function addPost(post: PostType) {
  const client = await db.connect();

  // check if there is a post with the same id
  const postExists = await client.query(`SELECT * FROM posts WHERE id = $1`, [
    post._id,
  ]);
  // if the post does not exist, insert it into the database
  if (!postExists.rows.length) {
    await client.query(
      `INSERT INTO posts (id, slug, title, description, tags) VALUES ($1, $2, $3, $4, $5)`,
      [post._id, post.slug.current, post.title, post.description, post.tag]
    );
  }

  client.release();
}

// Posts likes

export async function likePost(post_id: string, email: string) {
  const client = await db.connect();
  const user = await client.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  // check if the user has already liked the post
  const likeExists = await client.query(
    `SELECT * FROM posts_likes WHERE user_id = $1 AND post_id = $2`,
    [user.rows[0].id, post_id]
  );
  // if the user has not liked the post, insert the like into the database
  if (!likeExists.rows.length) {
    await client.query(
      `INSERT INTO posts_likes (user_id, post_id) VALUES ($1, $2)`,
      [user.rows[0].id, post_id]
    );
  } else {
    // if the user has liked the post, delete the like from the database
    await client.query(
      `DELETE FROM posts_likes WHERE user_id = $1 AND post_id = $2`,
      [user.rows[0].id, post_id]
    );
  }

  client.release();
  return likeExists.rows.length ? true : false;
}

export async function getPostLikes(post_id: string) {
  const client = await db.connect();
  // get the number of likes for the post
  const result = await client.query(
    `SELECT COUNT(*) AS likes FROM posts_likes WHERE post_id = $1`,
    [post_id]
  );
  const likes: string = result.rows[0].likes;
  // close the connection
  client.release();
  return likes;
}

export async function isPostLiked(post_id: string, email: string) {
  const client = await db.connect();
  const user = await client.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  // check if the user has already liked the post
  const likeExists = await client.query(
    `SELECT * FROM posts_likes WHERE user_id = $1 AND post_id = $2`,
    [user.rows[0].id, post_id]
  );
  client.release();
  return likeExists.rows.length ? true : false;
}

export async function getFeaturedPosts() {
  const client = await db.connect();
  // get the featured posts
  const result =
    await client.query(`SELECT post_id, posts.slug, posts.title, posts.description, COUNT(DISTINCT user_id) AS likes FROM posts_likes JOIN posts on posts_likes.post_id = posts.id GROUP BY posts_likes.post_id, posts.slug,posts.title, posts.description ORDER BY likes DESC LIMIT 6
`);
  const featuredPosts: {
    post_id: string;
    slug: string;
    title: string;
    description: string;
    likes: string;
  }[] = result.rows;
  // close the connection
  client.release();
  return featuredPosts;
}

// Posts bookmarks

export async function savePost(post_id: string, email: string) {
  const client = await db.connect();
  const user = await client.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  // check if the user has already saved the post
  const bookmarkExists = await client.query(
    `SELECT * FROM saved_posts WHERE user_id = $1 AND post_id = $2`,
    [user.rows[0].id, post_id]
  );
  // if the user has not bookmarked the post, insert the bookmark into the database
  if (!bookmarkExists.rows.length) {
    await client.query(
      `INSERT INTO saved_posts (user_id, post_id) VALUES ($1, $2)`,
      [user.rows[0].id, post_id]
    );
  } else {
    // if the user has bookmarked the post, delete the bookmark from the database
    await client.query(
      `DELETE FROM saved_posts WHERE user_id = $1 AND post_id = $2`,
      [user.rows[0].id, post_id]
    );
  }

  client.release();
  return bookmarkExists.rows.length ? true : false;
}

export async function getPostBookmarks(post_id: string) {
  const client = await db.connect();
  // get the number of bookmarks for the post
  const result = await client.query(
    `SELECT COUNT(*) AS bookmarks FROM saved_posts WHERE post_id = $1`,
    [post_id]
  );
  const bookmarks: string = result.rows[0].bookmarks;
  // close the connection
  client.release();
  return bookmarks;
}

export async function isPostBookmarked(post_id: string, email: string) {
  const client = await db.connect();
  const user = await client.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  // check if the user has already bookmarked the post
  const bookmarkExists = await client.query(
    `SELECT * FROM saved_posts WHERE user_id = $1 AND post_id = $2`,
    [user.rows[0].id, post_id]
  );
  client.release();
  return bookmarkExists.rows.length ? true : false;
}

export async function readingList(session: Session | null) {
  const email = session?.user?.email;
  const client = await db.connect();
  if (email) {
    const user = await client.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    const bookmarks = await client.query(
      `SELECT created_at, posts.slug, posts.title, posts.description, posts.tags FROM saved_posts JOIN posts ON post_id = posts.id WHERE user_id = $1 ORDER BY created_at DESC`,
      [user.rows[0].id]
    );
    client.release();

    const result: ReadingListType[] = bookmarks.rows;

    return result;
  } else {
    return [];
  }
}

export async function readingListCount(email: string) {
  const client = await db.connect();
  const user = await client.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  const bookmarks = await client.query(
    `SELECT COUNT(*) AS bookmarks FROM saved_posts WHERE user_id = $1`,
    [user.rows[0].id]
  );
  client.release();
  const result: string = bookmarks.rows[0].bookmarks;
  return result;
}

// Comments

export async function submitComment(FormData: FormData) {
  const post_id = FormData.get("post_id");
  const comment = FormData.get("comment");
  const email = FormData.get("email");
  const parent_id = FormData.get("parent_id");
  const client = await db.connect();
  const user = await client.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (parent_id === null || parent_id === undefined) {
    await client.query(
      `INSERT INTO comments (message, user_id, post_id) VALUES ($1, $2, $3)`,
      [comment, user.rows[0].id, post_id]
    );
    // close the connection
    client.release();
  } else {
    const result = await client.query(
      `INSERT INTO comments (message, user_id, post_id, parent_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [comment, user.rows[0].id, post_id, parent_id]
    );
    // close the connection
    client.release();
    return result.rows[0];
  }
}

export async function getParentComments(post_id: string) {
  const client = await db.connect();
  // get the parent comments
  const result = await client.query(
    `SELECT comments.id AS id, comments.message AS message, comments.created_at AS date, users.name, users.image, users.email FROM comments JOIN posts ON comments.post_id = posts.id JOIN users ON comments.user_id = users.id WHERE posts.id = $1 AND comments.parent_id IS NULL`,
    [post_id]
  );
  // close the connection
  client.release();
  const comments: Message[] = result.rows;
  return comments;
}

export async function getChildComments(parent_id: string) {
  const client = await db.connect();
  // get the child comments
  const result = await client.query(
    `SELECT comments.id AS id, comments.message AS message, comments.created_at AS date, users.name, users.image, users.email FROM comments JOIN posts ON comments.post_id = posts.id JOIN users ON comments.user_id = users.id WHERE comments.parent_id = $1`,
    [parent_id]
  );
  // close the connection
  client.release();
  const comments: Message[] = result.rows;
  return comments;
}

export async function deleteComment(comment_id: string) {
  const client = await db.connect();
  // delete the comment
  await client.query(`DELETE FROM comments WHERE id = $1`, [comment_id]);
  // close the connection
  client.release();
}

export async function likeComment(comment_id: string, email: string) {
  const client = await db.connect();
  const user = await client.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  // check if the user has already liked the comment
  const likeExists = await client.query(
    `SELECT * FROM comments_likes WHERE user_id = $1 AND comment_id = $2`,
    [user.rows[0].id, comment_id]
  );
  // if the user has not liked the comment, insert the like into the database
  if (!likeExists.rows.length) {
    await client.query(
      `INSERT INTO comments_likes (user_id, comment_id) VALUES ($1, $2)`,
      [user.rows[0].id, comment_id]
    );
  } else {
    // if the user has liked the comment, delete the like from the database
    await client.query(
      `DELETE FROM comments_likes WHERE user_id = $1 AND comment_id = $2`,
      [user.rows[0].id, comment_id]
    );
  }

  client.release();
  return likeExists.rows.length ? true : false;
}

export async function getCommentLikes(comment_id: string) {
  const client = await db.connect();
  // get the number of likes for the comment
  const result = await client.query(
    `SELECT COUNT(*) AS likes FROM comments_likes WHERE comment_id = $1`,
    [comment_id]
  );
  const likes: string = result.rows[0].likes;
  // close the connection
  client.release();
  return likes;
}

export async function isCommentLiked(comment_id: string, email: string) {
  const client = await db.connect();
  const user = await client.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  // check if the user has already liked the comment
  const likeExists = await client.query(
    `SELECT * FROM comments_likes WHERE user_id = $1 AND comment_id = $2`,
    [user.rows[0].id, comment_id]
  );
  client.release();
  return likeExists.rows.length ? true : false;
}

export async function commentsCount(post_id: string) {
  const client = await db.connect();
  // get the number of comments for the post
  const result = await client.query(
    `SELECT COUNT(*) AS comments FROM comments WHERE post_id = $1`,
    [post_id]
  );
  const comments: string = result.rows[0].comments;
  // close the connection
  client.release();
  return comments;
}
