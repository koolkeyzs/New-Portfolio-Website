import { Request, Response } from "express";
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