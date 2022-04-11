// Import packages
import { Router } from 'express';

// Import function files
import {
	preLogin,
	register,
	resendOtp,
	updatePassword,
	resetPassword,
	changePassword,
	verifyOtp,
	updateUserSettings,
	updateUserProfile,
} from './controllers/authentication';
import validate from './validate';
import staffs from './controllers/staffs';
import comments from './controllers/comments';
import businesses from './controllers/businesses';

const router = Router();

/*************************************************************************
API CALL START
*************************************************************************/

// INDEX ROUTE TO SHOW API IS WORKING FINE
router.get('/', (req, res) => {
	return res.status(200).send('API Working');
});

router.post('/register', validate('/register'), register);
router.post('/login', validate('/login'), preLogin);
router.post('/resend-otp', validate('/resend-otp'), resendOtp);
router.post('/update-password', validate('/update-password'), updatePassword);
router.post('/reset-password', validate('/reset-password'), resetPassword);
router.post('/change-password', validate('/change-password'), changePassword);
router.post('/verify-otp', validate('/verify-otp'), verifyOtp);
router.post('/update-user-settings', validate('/update-user-settings'), updateUserSettings);
router.post('/update-user-profile', validate('/update-user-profile'), updateUserProfile);

router.post('/staff/create', staffs.createStaff);
router.post('/staff/update/:id', staffs.updateStaff);
router.post('/staffs', staffs.getStaffs);
router.get('/staff/get-details/:id', staffs.getStaffDetails);
router.get('/staff/delete/:id', staffs.deleteStaff);

router.post('/comment/create', comments.createComment);
router.post('/comment/update/:id', comments.updateComment);
router.post('/comments', comments.getComments);
router.get('/comment/get-details/:id', comments.getCommentDetails);
router.get('/comment/delete/:id', comments.deleteComment);

router.post('/business/create', businesses.createBusiness);
router.post('/business/update/:id', businesses.updateBusiness);
router.get('/businesses', businesses.getBusinesses);
router.get('/business/get-details/:id', businesses.getBusinessDetails);
router.get('/business/delete/:id', businesses.deleteBusiness);

export default router;
