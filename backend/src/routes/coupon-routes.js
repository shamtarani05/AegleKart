const express = require('express');
const router = express.Router();
const {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
  validateCoupon
} = require('../controller/couponController');

router.post('/', createCoupon);
router.get('/', getAllCoupons);
router.delete('/:id', deleteCoupon);
router.post('/validate', validateCoupon);

module.exports = router;
