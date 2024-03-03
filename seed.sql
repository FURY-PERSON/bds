INSERT INTO public."role" ("name", "description") VALUES
    ('admin', 'admin role'),
    ('student', 'student role'),
    ('user', 'for all users'),
    ('worker', 'worker role');



INSERT INTO public."permissions" ("name", "description") VALUES
    ('admin', 'admin role'),
    ('student', 'student role'),
    ('user', 'for all users'),
    ('worker', 'worker role');


INSERT INTO public."featureFlagList" ("name") VALUES
    ('counter'),
    ('newDesign'),
    ('ratingCardOnMainPage'),
    ('test');

/* password: 12345 */
INSERT INTO public."user" ("firstName", "lastName", "phone", "login", "password", "email", "roleName") VALUES
    ('admin', 'admin', '+375446577833', 'admin', '$argon2id$v=19$m=65536,t=3,p=4$XInLLWi4jE3ObiZBt1M0qQ$21IKfOITUwgEWiiOW0mF+O1c0z5uxeagCJAGki1XuCE', 'sdfsd@gmail.com', 'admin')

INSERT INTO public."user_permissions_permission" ("userId", "permissionId") 
VALUES 
    ((Select id from public."user" where login = 'admin' LIMIT 1), (Select id from public."permission" where name = 'admin' LIMIT 1)),
    ((Select id from public."user" where login = 'admin' LIMIT 1), (Select id from public."permission" where name = 'user' LIMIT 1)),
    ((Select id from public."user" where login = 'admin' LIMIT 1), (Select id from public."permission" where name = 'worker' LIMIT 1)),
    ((Select id from public."user" where login = 'admin' LIMIT 1), (Select id from public."permission" where name = 'student' LIMIT 1));
