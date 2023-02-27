// Write your "projects" router here!
const express = require('express');

const Projects = require('./projects-model');

const { validateProjectId,  } = require('./projects-middleware');

const router = express.Router();

router.use(express.json());

router.get('/', (req, res, next) => {
    Projects.get()
        .then(projects => {
            // res.json(projects)
            if (!projects){
                res.send([])
            } else {
                res.json(projects)
            }
        })
        .catch(next)
})

router.get('/:id', validateProjectId, (req, res, next) => {
    Projects.get(req.params.id)
        .then(project => {
           res.json(project)
        })
        .catch(next)
});

router.post('/', (req, res, next) => {
    const { name, description } = req.body;
    if(!name || !name.trim()) {
        res.status(400).json({ message: 'name is required' })
    } else if(!description || !description.trim()){
        res.status(400).json({ message: 'description is required' })
    } else {
        Projects.insert(req.body)
        .then(project => {
            res.json(project)
        })
        .catch(next)
    }
});

router.put('/:id', validateProjectId, (req, res, next) => {
    const { name, description, completed } = req.body 
        if (!name || !name.trim()){
            res.status(400).json({ message: 'name is missing' })
        } else if (!description || !description.trim()){
            res.status(400).json({ message: 'description is missing' })
        } else if (completed === undefined) {
            res.status(400).json({ message: 'completed is missing' })
        } else {
            Projects.update(req.params.id, {name, description, completed})
                .then(() => {
                    return Projects.get(req.params.id)
                })
                .then(project => {
                    res.json(project)
                })
                .catch(next);
        }
    // }
});

router.delete('/:id', validateProjectId, (req, res) => {
     Projects.remove(req.params.id)
     res.json({ message: 'project deleted' })
})

router.get('/:id/actions', validateProjectId, async (req, res, next) => {
    try {
        const result = await Projects.getProjectActions(req.params.id)
        res.json(result)
    } catch (error) {
        next(error)
    }
})

router.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        message: error.message,
        stack: error.stack
    });
});

module.exports = router;