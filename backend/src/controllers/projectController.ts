import type { Request, Response } from "express";
import Project from '../models/project';

export const createProject = async ( req: Request,res: Response): Promise<void> =>{
    try {

        const {
            title,
            description,
            image,
            technologies,
            category,
            liveUrl,
            githubUrl,
            featured,
            published
        } = req.body

        if (!title || !description || !technologies || !category){
            res.status(400).json({
                success : false, 
                message: 'Please provide alll required field'
            })
            return;
        }

        const project = await Project.create({
            title,
            description,
            image,
            technologies,
            category,
            liveUrl,
            githubUrl,
            featured,
            published

        })

        res.status(200).json({
            success : true,
            message : 'Project created succesfully'
        })
        
    } catch (error) {
        console.error('Create project error' , error)
        res.status(500).json({
            success: false,
            message : 'Failed to create project'
        })
    }
}

export const getProjects = async ( req: Request,res: Response): Promise<void> =>{
  try {
    const projects = await Project.find().sort({createdAt:-1})
    res.status(200).json({
        success : true, 
        count : projects.length,
        projects
    })
  } catch (error) {
    console.error('Get projects error' , error)
        res.status(500).json({
            success: false,
            message : 'Failed to retrieve project'
        })
    
  }
}


export const getProjectById = async ( req: Request,res: Response): Promise<void> =>{
  try {
    const {id} = req.params
    const projects = await Project.findById(id)

    if(!projects){
        res.status(404).json({
        success : true, 
        message : 'Project not found'
    })
    return;

    }

     res.status(200).json({
        success : true, 
        projects
    })


    
  } catch (error) {
    console.error('Get projects error' , error)
        res.status(500).json({
            success: false,
            message : 'Failed to retrieve project'
        })
    
  }
}


export const updateProject =  async ( req: Request,res: Response): Promise<void> =>{
    try {
        const {id} = req.params

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators : true
            }
        )

        if(!updatedProject){
            res.status(404).json({
        success : true, 
        message : 'Project not found'
    })
    return; 
        }


         res.status(200).json({
        success : true, 
        message: 'project successfully updated',
        project : updatedProject
    })

    } catch (error) {
         console.error('Update project error' , error)
        res.status(500).json({
            success: false,
            message : 'Failed to update project'
        })
        
    }
}


export const deleteProject =  async ( req: Request,res: Response): Promise<void> =>{
    try {
        const {id} = req.params

        const deletedProject = await Project.findByIdAndDelete(id)

        if(!deletedProject){
            res.status(404).json({
        success : true, 
        message : 'Project not found'
    })
    return; 
        }
         res.status(200).json({
        success : true, 
        message: 'project successfully deleted',
    })

    } catch (error) {
         console.error('Delete project error' , error)
        res.status(500).json({
            success: false,
            message : 'Failed to delete project'
        })
        
    }
}