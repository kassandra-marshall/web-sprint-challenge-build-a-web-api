// add middlewares here related to projects
const Projects = require('./projects-model');

async function validateProjectId(req, res, next) {
    try {
        const project = await Projects.get(req.params.id)
        if (!project){
            res.status(404).json({ message: 'project not found' });
        } else {
            req.project = project
            next();
        }
    } catch (error) {
        res.status(500).json({ message: 'problem finding project' });
    }
};

// function validateNewProject(req, res, next) {
//         const { name } = req.body;
//         if (name){
//             req.name = name.trim()
//             next()
//         } else {
//             res.status(400)
//         }
// }

module.exports = {
    validateProjectId,
    // validateNewProject
}