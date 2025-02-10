"use server";

import { redirect } from "next/navigation";
import { SignupFormSchema, FormState } from "@/app/lib/definitions";
import bcrypt from "bcryptjs";
import { db } from "@vercel/postgres";

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Call the provider or db to create a user...

  // Prepare data for insertion into database
  const { name, email, password } = validatedFields.data;
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // call the db to create the user
  const client = await db.connect();
  // creates a user's table is it does not exists
  await client.query(
    `CREATE TABLE IF NOT EXISTS users (
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) PRIMARY KEY,
      password VARCHAR(255) NOT NULL
    )`
  );
  // check if there is a user with the same email
  const user = await client.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (!user.rows.length) {
    // insert the user into the database
    await client.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
      [name, email, hashedPassword]
    );
  } else {
    // modify the state to show the error
    return {
      errors: {
        email: ["Email already exists"],
      },
    };
  }

  // close the connection
  client.release();

  // Redirect the user to the sign in page
  redirect("/signIn");
}
