import {Request, Response} from 'express';
import prisma from '../config/db';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

export const createUser = async (req: Request, res: Response) => {
    let hashedPassword = await argon2.hash(req.body.password);
    try {
        const newUser = await prisma.user.create({
            data: {
                email: req.body.email,
                password: hashedPassword
            }
        });

        if (newUser) {
            res.status(200).json({ "msg": "The user has been created", newUser })
        }
    }
    catch (error) {
        res.status(500).json(error)

    }
}
// export const createUser = async (req:Request, res:Response) =>{
//     const hash = await argon2.hash(req.body.password);
//     try{
//         const user = await prisma.user.create({
//             data:{
//                 name:req.body.name,
//                 email: req.body.email,
//                 password: hash
//             }

//         });
        
//         if(user){
//             console.log(hash);

//             res.status(200).json({msg:"user created!"})
//         }
//     }catch(e){
//         res.status(500).json({msg:`Error: ${e}`});
//     }
// };



export const login = async (req:Request, res:Response)=>{

    const user = await prisma.user.findUnique({
        where:{
            email: req.body.email
        }
    });

    if(!user){
        return res.status(400).json({Error:"Wrong email adress"});
    }else if(!await argon2.verify(user.password, req.body.password)){
        return res.status(400).json({Error:"Wrong password"});
    }

    const token = jwt.sign({
        id: user.id,
        name: user.name,
    }, process.env.JWT_SECRET as string, {
        expiresIn: '5h'
    });
    return res.status(200).json({
        message:`Hello ${user.name}`,
        token: token
    });

}

export const updateUser = async (req:Request, res:Response) =>{
    try{
        const updateduser = await prisma.user.updateMany({
            where:{
                id: res.locals.user.id
            },
            data:{
               name: req.body.name,
               email: req.body.email,
               password: req.body.password


            }
        });
        if(updateduser.count == 0){
            throw("No user Updated");
        }
        res.status(200).json({msg:"user updated!"});
        
    }catch(e){
        res.status(500).json({msg:`Error: ${e}`});
    }
}

export const deleteUser = async (req:Request, res:Response) =>{
    try{
        const deleteduser = await prisma.user.deleteMany({
            where:{
                id: res.locals.user.id
            }
        });
        if(deleteduser.count == 0){
            throw("No user Deleted");
        }
        res.status(200).json({msg:"user deleted!"});
        
    }catch(e){
        res.status(500).json({msg:`Error: ${e}`});
    }
}