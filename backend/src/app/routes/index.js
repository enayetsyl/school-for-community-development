import { Router } from 'express';
import { UserRoutes } from '../module/User/user.route.js';
import { PostRoutes } from '../module/Post/post.route.js';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  }, 
  {
    path:'/posts',
    route: PostRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route)); 

export default router;
