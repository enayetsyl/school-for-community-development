import express from 'express'
import { PostControllers } from './post.controller.js'
import { upload } from '../../utils/sendImageToCloudinary.js'
import verifyToken from '../../middlewares/auth.js'

const router = express.Router()

router.post('/create-post', verifyToken, upload.fields([{ name: 'image' }, { name: 'video' }]), PostControllers.createPost)
router.get('/posts', PostControllers.getAllPosts)
router.get('/posts/:id', PostControllers.getPostById)
router.get('/category/:category', PostControllers.getPostsByCategory)
router.get('/preview', PostControllers.getPreview)

export const PostRoutes = router