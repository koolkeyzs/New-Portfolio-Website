import {Router} from 'express'
import protect from '../middleware/auth'

import
    {createProject ,
     getProjects, getProjectById, 
     updateProject, 
     deleteProject } 
     from '../controllers/projectController'

     const router = Router()

     // Get all projects
     router.get('/' , protect , getProjects)

     //Get one project
     router.get('/:id' ,protect, getProjectById)

     // create a project
     router.post('/' , protect , createProject)

     // Update 

     router.patch('/:id' , protect ,updateProject )

     // Delete
     router.delete('/:id' , protect ,deleteProject )

     export default router



