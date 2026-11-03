import {Router} from 'express'
import protect from '../middleware/auth'
import upload from '../middleware/upload'

import
    {createProject ,
     getProjects, getProjectById, 
     updateProject, 
     deleteProject,
    getPublicProjects} 
     from '../controllers/projectController'

    
     const router = Router()


     router.get('/public' , getPublicProjects )

     // Get all projects
     router.get('/' , protect , getProjects)

     //Get one project
     router.get('/:id' ,protect, getProjectById)

     // create a project
     router.post('/' , protect , upload.single('image'), createProject)

     // Update 

     router.patch('/:id' , protect , upload.single('image') ,updateProject )

     // Delete
     router.delete('/:id' , protect ,deleteProject )

     export default router



