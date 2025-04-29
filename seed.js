// script.js
import "dotenv/config";
import { Client } from "pg";

const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function createTable() {
  try {
    await client.connect();
    console.log("💅 Connected to NeonDB");

    const query = `
      CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      firstname VARCHAR(255) NOT NULL,
      surname VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      bio TEXT NULL,
      image TEXT,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    );

      CREATE TABLE IF NOT EXISTS posts (
      id UUID PRIMARY KEY NOT NULL,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      tags TEXT[] NOT NULL,
      description TEXT NOT NULL
    );

      CREATE TABLE IF NOT EXISTS posts_likes (
      user_id UUID NOT NULL,
      post_id UUID NOT NULL,
      PRIMARY KEY (user_id, post_id),
      CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS saved_posts (
      user_id UUID NOT NULL,
      post_id UUID NOT NULL,
      PRIMARY KEY (user_id, post_id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE,
      CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS comments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now(),
      user_id UUID NOT NULL,
      post_id UUID NOT NULL,
      parent_id UUID NULL,
      CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS comments_likes (
      user_id UUID NOT NULL,
      comment_id UUID NOT NULL,
      PRIMARY KEY (user_id, comment_id),
      CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_comment FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
    );

    INSERT INTO users (id, name, firstname, surname, email, password, image) 
    VALUES ('8d0fe040-fe77-4153-a1a1-12b78b6f3254',
    'Guillermo Rauch', 
    'Guillermo', 'Rauch', 
    'johndoe@gmail.com', 
    '$2a$10$0WBF1B4/JGlAXoA1gRJIJu9oJMYuIFT0a5QQK.ghpGfU09LVGVePi', 
    'joshcoderblog/9cad0467-1e62-435b-b1b5-e61d0f2c48d0gillermo-rauch.jpg');

    INSERT INTO users (id, name, firstname, surname, email, password, image) 
    VALUES ('2a4f4c77-420f-45d2-9088-17a1214be02e', 
    'Mark Zuckerberg',
    'Mark', 
    'Zuckerberg', 
    'johndoe1@gmail.com', 
    '$2a$10$0WBF1B4/JGlAXoA1gRJIJu9oJMYuIFT0a5QQK.ghpGfU09LVGVePi', 
    'joshcoderblog/1cc9e133-d894-400a-bc80-02cac64e762cMark_Zuckerberg.jpg');

    INSERT INTO users (id, name, firstname, surname, email, password, image) 
    VALUES ('3e0ef2da-0f7e-4132-b147-01f457180457', 
    'Satya Nadella',
    'Satya', 
    'Nadella', 
    'johndoe2@gmail.com', 
    '$2a$10$0WBF1B4/JGlAXoA1gRJIJu9oJMYuIFT0a5QQK.ghpGfU09LVGVePi', 
    'joshcoderblog/3e0ef2da-0f7e-4132-b147-01f457180457Nadella-Satya.jpg');

    INSERT INTO posts (id, slug, title, description, tags) 
    VALUES ('f3698891-0207-4e4e-944b-7f9f6ffc4f45', 
    'how-to-use-css-effectively-in-react-applications', 
    'How to Use CSS Effectively in React Applications', 
    'Styling is a crucial part of web development, and React offers several ways to integrate CSS into your applications. Whether you’re building a small project or a large-scale application, understanding the different methods of applying CSS can help you maintain clean, scalable, and efficient code.', 
    '{CSS, React}');

    INSERT INTO posts (id, slug, title, description, tags) 
    VALUES ('79385117-9e15-4ce8-9fe0-c1aa15272b8a', 
    'essential-javascript-methods-for-react-developers', 
    'Essential JavaScript Methods for React Developers', 
    'React is a powerful library for building user interfaces, and mastering JavaScript is key to becoming an effective React developer. In this post, we’ll explore some essential JavaScript methods that can help you write cleaner, more efficient code in your React applications.', 
    '{JavaScript, React}');

    INSERT INTO posts (id, slug, title, description, tags) 
    VALUES ('f0494be1-0ca0-4f80-a18c-681b3723a547', 
    'an-in-depth-guide-to-programming-languages-and-their-purposes', 
    'An In-Depth Guide to Programming Languages and Their Purposes', 
    'Programming languages are essential tools that enable us to communicate with computers and create various software applications. Each language has its unique features and is designed with specific purposes in mind.', 
    '{Languages}');

    INSERT INTO posts (id, slug, title, description, tags) 
    VALUES ('bdd3e733-5408-479e-b6eb-e6c310b470dd', 
    'html-and-modern-web-development', 
    'HTML and Modern Web Development', 
    'HTML (HyperText Markup Language) is the backbone of the web. It has evolved significantly since its inception, and today, it plays a crucial role in modern web development.', 
    '{HTML}');

    INSERT INTO posts (id, slug, title, description, tags) 
    VALUES ('99ff841b-2ae2-4e21-b781-18bd9e558df9', 
    'how-typescript-empowers-developers-to-write-better-code', 
    'How TypeScript Empowers Developers to Write Better Code', 
    'In the ever-evolving world of software development, the demand for scalable, maintainable, and error-free code is higher than ever. Enter TypeScript, a language that has taken the development community by storm.', 
    '{TypeScript}');

    INSERT INTO posts (id, slug, title, description, tags) 
    VALUES ('4b856f73-3d7d-42ee-827c-9b75b240ebd5', 
    'how-node-js-propelled-javascript-to-the-top-of-the-programming-world', 
    'How Node.js Propelled JavaScript to the Top of the Programming World', 
    'JavaScript, once considered a language primarily for client-side scripting, has undergone a remarkable transformation over the past decade. This transformation can be largely attributed to the advent of Node.js, a runtime environment that has revolutionized the way developers use JavaScript.', 
    '{React, Next.js}');

    INSERT INTO posts (id, slug, title, description, tags) 
    VALUES ('f4eb1243-384f-417e-9f6a-937bead1ce0a', 
    'how-next-js-can-revolutionize-web-development', 
    'How Next.js Can Revolutionize Web Development', 
    'In the ever-evolving landscape of web development, choosing the right framework can significantly impact the efficiency, performance, and scalability of your projects. Next.js, an open-source React framework, has emerged as a powerful tool for developers aiming to build modern web applications.', 
    '{JavaScript, Node.js}');

    INSERT INTO posts_likes (user_id, post_id) VALUES ('3e0ef2da-0f7e-4132-b147-01f457180457', 'f3698891-0207-4e4e-944b-7f9f6ffc4f45');
    INSERT INTO posts_likes (user_id, post_id) VALUES ('2a4f4c77-420f-45d2-9088-17a1214be02e', 'f3698891-0207-4e4e-944b-7f9f6ffc4f45');
    INSERT INTO posts_likes (user_id, post_id) VALUES ('3e0ef2da-0f7e-4132-b147-01f457180457', '79385117-9e15-4ce8-9fe0-c1aa15272b8a');
    INSERT INTO posts_likes (user_id, post_id) VALUES ('2a4f4c77-420f-45d2-9088-17a1214be02e', '79385117-9e15-4ce8-9fe0-c1aa15272b8a');
    INSERT INTO posts_likes (user_id, post_id) VALUES ('3e0ef2da-0f7e-4132-b147-01f457180457', 'f0494be1-0ca0-4f80-a18c-681b3723a547');
    INSERT INTO posts_likes (user_id, post_id) VALUES ('2a4f4c77-420f-45d2-9088-17a1214be02e', 'f0494be1-0ca0-4f80-a18c-681b3723a547');
    INSERT INTO posts_likes (user_id, post_id) VALUES ('3e0ef2da-0f7e-4132-b147-01f457180457', 'bdd3e733-5408-479e-b6eb-e6c310b470dd');
    INSERT INTO posts_likes (user_id, post_id) VALUES ('2a4f4c77-420f-45d2-9088-17a1214be02e', 'bdd3e733-5408-479e-b6eb-e6c310b470dd');
    INSERT INTO posts_likes (user_id, post_id) VALUES ('3e0ef2da-0f7e-4132-b147-01f457180457', '99ff841b-2ae2-4e21-b781-18bd9e558df9');
    INSERT INTO posts_likes (user_id, post_id) VALUES ('2a4f4c77-420f-45d2-9088-17a1214be02e', '99ff841b-2ae2-4e21-b781-18bd9e558df9');
    INSERT INTO posts_likes (user_id, post_id) VALUES ('3e0ef2da-0f7e-4132-b147-01f457180457', '4b856f73-3d7d-42ee-827c-9b75b240ebd5');
    INSERT INTO posts_likes (user_id, post_id) VALUES ('2a4f4c77-420f-45d2-9088-17a1214be02e', '4b856f73-3d7d-42ee-827c-9b75b240ebd5');
    INSERT INTO posts_likes (user_id, post_id) VALUES ('3e0ef2da-0f7e-4132-b147-01f457180457', 'f4eb1243-384f-417e-9f6a-937bead1ce0a');
    INSERT INTO posts_likes (user_id, post_id) VALUES ('2a4f4c77-420f-45d2-9088-17a1214be02e', 'f4eb1243-384f-417e-9f6a-937bead1ce0a');
    INSERT INTO posts_likes (user_id, post_id) VALUES ('8d0fe040-fe77-4153-a1a1-12b78b6f3254', 'f4eb1243-384f-417e-9f6a-937bead1ce0a');

    INSERT INTO saved_posts (user_id, post_id) VALUES ('8d0fe040-fe77-4153-a1a1-12b78b6f3254', 'f4eb1243-384f-417e-9f6a-937bead1ce0a');
    INSERT INTO saved_posts (user_id, post_id) VALUES ('8d0fe040-fe77-4153-a1a1-12b78b6f3254', 'f3698891-0207-4e4e-944b-7f9f6ffc4f45');
    INSERT INTO saved_posts (user_id, post_id) VALUES ('8d0fe040-fe77-4153-a1a1-12b78b6f3254', '79385117-9e15-4ce8-9fe0-c1aa15272b8a');
    INSERT INTO saved_posts (user_id, post_id) VALUES ('8d0fe040-fe77-4153-a1a1-12b78b6f3254', 'f0494be1-0ca0-4f80-a18c-681b3723a547');
    INSERT INTO saved_posts (user_id, post_id) VALUES ('8d0fe040-fe77-4153-a1a1-12b78b6f3254', 'bdd3e733-5408-479e-b6eb-e6c310b470dd');
    INSERT INTO saved_posts (user_id, post_id) VALUES ('8d0fe040-fe77-4153-a1a1-12b78b6f3254', '99ff841b-2ae2-4e21-b781-18bd9e558df9');
    INSERT INTO saved_posts (user_id, post_id) VALUES ('8d0fe040-fe77-4153-a1a1-12b78b6f3254', '4b856f73-3d7d-42ee-827c-9b75b240ebd5');

    INSERT INTO comments (id, message, user_id, post_id)
    VALUES ('6ab35412-b3b5-44d4-9050-fdfd808348ae',
    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vehicula cras eu ultrices integer primis consequat feugiat enim aliquet vel felis per sociosqu. Eros purus lorem curae rhoncus curae imperdiet vivamus hac mi donec quisque euismod rutrum. Tincidunt risus blandit commodo eu congue sit donec semper interdum inceptos parturient consequat diam. Massa vulputate faucibus luctus nulla viverra porta mattis neque mollis ligula imperdiet accumsan placerat. Aenean nisl vitae diam interdum consequat netus facilisi convallis arcu neque donec euismod risus.</p>',
    '8d0fe040-fe77-4153-a1a1-12b78b6f3254',
    'f0494be1-0ca0-4f80-a18c-681b3723a547');

    INSERT INTO comments (id, message, user_id, post_id)
    VALUES ('8a15f280-c0e8-4450-8eb3-7426059086ff',
    '<p>Malesuada elit commodo convallis nunc lacus laoreet. Vulputate dictum habitasse luctus vivamus facilisi netus. Tincidunt euismod maecenas sollicitudin id fusce auctor. Volutpat consectetur urna elit urna id curabitur. Condimentum suscipit fermentum velit eleifend faucibus tempor. Scelerisque euismod pharetra mollis nascetur sollicitudin tincidunt.</p>',
    '3e0ef2da-0f7e-4132-b147-01f457180457',
    'bdd3e733-5408-479e-b6eb-e6c310b470dd');

    INSERT INTO comments (id, message, user_id, post_id)
    VALUES ('2eb229b7-c60d-4e13-b194-f08909e12e47',
    '<p>Enim posuere hac fermentum interdum porta massa at. Eu fringilla dictumst bibendum tortor molestie molestie feugiat. Diam posuere tincidunt rutrum vitae ligula dapibus cum. Sapien aptent velit iaculis vulputate vestibulum semper cubilia. Erat porta netus euismod elementum vehicula eget sem.</p>',
    '2a4f4c77-420f-45d2-9088-17a1214be02e',
    'f0494be1-0ca0-4f80-a18c-681b3723a547');

    INSERT INTO comments (id, message, user_id, post_id, parent_id)
    VALUES ('6ea17b7c-4541-4b79-a97a-b078de3a2605',
    '<p>Urna enim euismod et consectetur. Dictumst morbi bibendum suscipit imperdiet. Ornare eget odio sociosqu mus. Mollis arcu sapien ultricies senectus. Vitae vestibulum rutrum bibendum posuere.</p>',
    '3e0ef2da-0f7e-4132-b147-01f457180457',
    'f0494be1-0ca0-4f80-a18c-681b3723a547',
    '6ab35412-b3b5-44d4-9050-fdfd808348ae');

    INSERT INTO comments (id, message, user_id, post_id)
    VALUES ('fd23885c-32ae-4c49-8c7f-37d5602b7a5c',
    '<p>Elit litora malesuada mattis vitae suspendisse nullam. Lacus massa hac purus erat habitasse tellus. Ante eu imperdiet sed tincidunt tellus litora. Molestie sociis cum parturient hendrerit odio lacinia. Bibendum leo erat at hac tincidunt dapibus. Duis viverra ac aenean ligula vestibulum natoque.</p>',
    '3e0ef2da-0f7e-4132-b147-01f457180457',
    '99ff841b-2ae2-4e21-b781-18bd9e558df9');

    INSERT INTO comments (id, message, user_id, post_id)
    VALUES ('3ca62307-36da-4dc7-bae5-70d53e3cd846',
    '<p>Arcu turpis mattis rutrum mauris. Suscipit in neque pharetra in. Conubia purus elit mauris accumsan. Urna primis mauris eleifend lorem. Eleifend blandit class imperdiet metus. Tempus semper faucibus eget dignissim.</p>',
    '2a4f4c77-420f-45d2-9088-17a1214be02e',
    '4b856f73-3d7d-42ee-827c-9b75b240ebd5');

    INSERT INTO comments (id, message, user_id, post_id)
    VALUES ('dd34ab66-800a-4284-9e0e-ba4a7093764f',
    '<p>Risus tortor dignissim ullamcorper platea rutrum nisl accumsan. Quis velit taciti nam eu habitant litora condimentum. Ridiculus laoreet fringilla ullamcorper taciti dignissim est elit.</p>',
    '8d0fe040-fe77-4153-a1a1-12b78b6f3254',
    'f4eb1243-384f-417e-9f6a-937bead1ce0a');

    INSERT INTO comments (id, message, user_id, post_id)
    VALUES ('da90b283-b852-4116-8e44-8eb44b1b4574',
    '<p>Ad vestibulum sollicitudin sed sed nostra turpis porta. Magna at non elit duis nunc commodo sociosqu. Accumsan nullam parturient per urna mi mauris turpis. Risus euismod ornare maecenas aliquam lacus ipsum volutpat.</p>',
    '8d0fe040-fe77-4153-a1a1-12b78b6f3254',
    '79385117-9e15-4ce8-9fe0-c1aa15272b8a');

    INSERT INTO comments (id, message, user_id, post_id)
    VALUES ('0f8bb6fe-a9b3-4251-ae41-80ccaf2e783c',
    '<p>Dignissim ac ipsum molestie etiam platea eleifend. Quisque molestie morbi sociis sapien lobortis nisi. Vitae class ornare non integer habitasse habitant. Velit cras lobortis hac suscipit sagittis laoreet. Sollicitudin morbi fusce non metus nisl condimentum. Sit dictumst taciti sociosqu tincidunt porta turpis.</p>',
    '3e0ef2da-0f7e-4132-b147-01f457180457',
    'f3698891-0207-4e4e-944b-7f9f6ffc4f45');

    INSERT INTO comments (id, message, user_id, post_id, parent_id)
    VALUES ('7911f529-0165-4df5-82b2-040e95374ed5',
    '<p>Est nec auctor erat taciti potenti dictumst. Curabitur parturient commodo cubilia eros accumsan tellus. Ullamcorper nostra netus hac erat hac erat.</p>',
    '2a4f4c77-420f-45d2-9088-17a1214be02e',
    'f3698891-0207-4e4e-944b-7f9f6ffc4f45',
    '0f8bb6fe-a9b3-4251-ae41-80ccaf2e783c');

    INSERT INTO comments (id, message, user_id, post_id)
    VALUES ('be2bce03-ff1f-4b9d-9fcb-0db4d09c287f',
    '<p>Sodales ridiculus etiam fermentum consectetur venenatis ante. Eu vivamus nostra porttitor nullam duis justo. Metus amet pellentesque ornare vel nisl accumsan.</p>',
    '8d0fe040-fe77-4153-a1a1-12b78b6f3254',
    'f3698891-0207-4e4e-944b-7f9f6ffc4f45');

    INSERT INTO comments_likes (user_id, comment_id) 
    VALUES ('8d0fe040-fe77-4153-a1a1-12b78b6f3254', 'be2bce03-ff1f-4b9d-9fcb-0db4d09c287f');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('2a4f4c77-420f-45d2-9088-17a1214be02e', 'be2bce03-ff1f-4b9d-9fcb-0db4d09c287f');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('3e0ef2da-0f7e-4132-b147-01f457180457', 'be2bce03-ff1f-4b9d-9fcb-0db4d09c287f');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('8d0fe040-fe77-4153-a1a1-12b78b6f3254', '7911f529-0165-4df5-82b2-040e95374ed5');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('2a4f4c77-420f-45d2-9088-17a1214be02e', '7911f529-0165-4df5-82b2-040e95374ed5');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('3e0ef2da-0f7e-4132-b147-01f457180457', '7911f529-0165-4df5-82b2-040e95374ed5');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('8d0fe040-fe77-4153-a1a1-12b78b6f3254', '6ea17b7c-4541-4b79-a97a-b078de3a2605');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('2a4f4c77-420f-45d2-9088-17a1214be02e', '6ea17b7c-4541-4b79-a97a-b078de3a2605');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('3e0ef2da-0f7e-4132-b147-01f457180457', '6ea17b7c-4541-4b79-a97a-b078de3a2605');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('8d0fe040-fe77-4153-a1a1-12b78b6f3254', '2eb229b7-c60d-4e13-b194-f08909e12e47');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('2a4f4c77-420f-45d2-9088-17a1214be02e', '2eb229b7-c60d-4e13-b194-f08909e12e47');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('3e0ef2da-0f7e-4132-b147-01f457180457', '2eb229b7-c60d-4e13-b194-f08909e12e47');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('8d0fe040-fe77-4153-a1a1-12b78b6f3254', '6ab35412-b3b5-44d4-9050-fdfd808348ae');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('2a4f4c77-420f-45d2-9088-17a1214be02e', '6ab35412-b3b5-44d4-9050-fdfd808348ae');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('3e0ef2da-0f7e-4132-b147-01f457180457', '6ab35412-b3b5-44d4-9050-fdfd808348ae');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('8d0fe040-fe77-4153-a1a1-12b78b6f3254', 'dd34ab66-800a-4284-9e0e-ba4a7093764f');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('2a4f4c77-420f-45d2-9088-17a1214be02e', 'dd34ab66-800a-4284-9e0e-ba4a7093764f');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('3e0ef2da-0f7e-4132-b147-01f457180457', 'dd34ab66-800a-4284-9e0e-ba4a7093764f');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('8d0fe040-fe77-4153-a1a1-12b78b6f3254', 'fd23885c-32ae-4c49-8c7f-37d5602b7a5c');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('2a4f4c77-420f-45d2-9088-17a1214be02e', 'fd23885c-32ae-4c49-8c7f-37d5602b7a5c');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('3e0ef2da-0f7e-4132-b147-01f457180457', 'fd23885c-32ae-4c49-8c7f-37d5602b7a5c');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('3e0ef2da-0f7e-4132-b147-01f457180457', 'da90b283-b852-4116-8e44-8eb44b1b4574');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('2a4f4c77-420f-45d2-9088-17a1214be02e', 'da90b283-b852-4116-8e44-8eb44b1b4574');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('2a4f4c77-420f-45d2-9088-17a1214be02e', '3ca62307-36da-4dc7-bae5-70d53e3cd846');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('2a4f4c77-420f-45d2-9088-17a1214be02e', '8a15f280-c0e8-4450-8eb3-7426059086ff');
    INSERT INTO comments_likes (user_id, comment_id)
    VALUES ('3e0ef2da-0f7e-4132-b147-01f457180457', '8a15f280-c0e8-4450-8eb3-7426059086ff');
    `;
    // 8a15f280-c0e8-4450-8eb3-7426059086ff
    await client.query(query);
    console.log("✨ Table created (or already exists)");
  } catch (err) {
    console.error("💀 Error creating table:", err);
  } finally {
    await client.end();
    console.log("👋 Connection closed");
  }
}

createTable();
