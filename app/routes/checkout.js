const express = require('express');
const router = express.Router();
const app = express();
app.use(express.static('public'));

const checkoutController = require('../controllers/checkoutController')

router.get('/checkout', checkoutController.home);
router.post('/checkout',checkoutController.confirm);
router.delete('/checkout',checkoutController.deleteSession);
module.exports = router;