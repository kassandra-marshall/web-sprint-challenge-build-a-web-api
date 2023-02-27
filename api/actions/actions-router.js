// Write your "actions" router here!
const express = require('express');

const Actions = require('./actions-model');

const { validateActionId, validateAction } = require('./actions-middlware');
const { validateProjectId } = require('../projects/projects-middleware')

const router = express.Router();

router.use(express.json());

router.get('/', (req, res, next) => {
    Actions.get(req.params.id)
        .then(actions => {
            res.json(actions)
        })
        .catch(next);
});

router.get('/:id', validateActionId, (req, res, next) => {
    Actions.get(req.params.id)
        .then(actions => {
            res.json(actions)
        })
        .catch(next);
});

router.post('/', validateProjectId, validateAction, (req, res, next) => {
    Actions.insert(req.body)
        .then(action => {
            res.json(action)
        })
        .catch(next)
})

router.put('/:id', validateActionId, (req, res, next) => {
    const { project_id, description, notes } = req.body
    if (!project_id){
        res.status(400).json({ message: 'project id is missing' })
    } else if (!description || !description.trim()){
        res.status(400).json({ message: 'description is missing' })
    } else if(!notes || !notes.trim()) {
        res.status(400).json({ message: 'notes are missing' })
    } else {
        Actions.update(req.params.id, req.body)
        .then(() => {
            return Actions.get(req.params.id)
        }) .then(action => {
            res.json(action)
        })
        .catch(next)   
    }
})

router.delete('/:id', validateActionId, (req, res, next) => {
    // time out happens, test when get method is fixed
    // take away async await or add to promise
    Actions.remove(req.params.id)
    .then(res.json({ message: 'project deleted'}))
    .catch(next)
})


router.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        message: error.message,
        stack: error.stack
    })
})

module.exports = router;