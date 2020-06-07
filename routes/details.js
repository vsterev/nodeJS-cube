const express = require('express');
const router = express.Router();
router.get('/', (req,res)=>{
    res.redirect('/')
});
router.get('/:id', (req,res)=>{
    const id = req.params.id;
    res.send(`Details id is - ${id}`);
})
module.exports = router;