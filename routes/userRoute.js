const router = require('express').Router();

// IMPORT OF CONTROLLERS
const {addUser,getAllUsers,getSingleUser,editUser,deleteUser,loginUser,sendOtp,verifyotp,resetPassword,sendEmailOtp,verifyEmailOtp,getUserCount} = require('../controllers/userController')

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Endpoints related to users
*/

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all registered users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of all registered users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '##/models/userModel'
 */
// GETTING ALL REGISTERED USRS
router.get('/',getAllUsers)




router.get('/getUserCount',getUserCount)


/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         schema:
 *           $ref: '##/models/userModel'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

// GET SINGLE USER
router.get('/:id',getSingleUser)

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Add a new user
 *     tags: 
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *                 example: example@example.com
 *               phone:
 *                 type: string
 *                 description: The phone number of the user
 *                 example: "+1234567890"
 *               fullname:
 *                 type: string
 *                 description: The full name of the user
 *               password:
 *                 type: string
 *                 description: The password for the user account
 *               country:
 *                 type: string
 *                 description: The country of residence of the user
 *               city:
 *                 type: string
 *                 description: The city of residence of the user
 *               address:
 *                 type: string
 *                 description: The address of the user
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 description: The role of the user (admin or user)
 *     responses:
 *       200:
 *         description: User added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '##/models/userModel'
 *       400:
 *         description: Bad request. Invalid user data.
 *       500:
 *         description: Internal server error
 */

// ADDING NEW USER
router.post("/", addUser);


/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '##/models/userModel'
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *                 example: "user@example.com"
 *               phone:
 *                 type: string
 *                 description: The phone number of the user
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Bad request. Invalid user data.
 *       500:
 *         description: Internal server error
 */
// LOGIN USER
router.post('/login', loginUser);


/**
 * @swagger
 * /user/resetpassword:
 *   post:
 *     summary: Reset user password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '##/models/userModel'
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - email
 *               - phone
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// RESET USER PASSWORD
router.post('/resetpassword', resetPassword);


/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               country:
 *                 type: string
 *               phone:
 *                 type : string
 *             $ref: '##/models/userModel'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         schema:
 *           $ref: '##/models/userModel'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// EDIT USER
router.put('/:id',editUser);


/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to delete
 *         required: true
 *         schema:
 *           type: string
 *           $ref: '##/models/userModel'
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// DELETE USER
router.delete('/:id',deleteUser);


/**
 * @swagger
 * /user/sendotp:
 *   post:
 *     summary: Send OTP to a user's phone number
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '##/models/userModel'
 *             properties:
 *               phone:
 *                 type: string
 *                 description: The phone number to send the OTP to
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Bad request. Invalid phone number.
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// SEND OTP
router.post('/sendotp',sendOtp)


/**
 * @swagger
 * /user/verifyotp:
 *   post:
 *     summary: Verify OTP sent to a user's phone number
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '##/models/userModel'
 *             properties:
 *               otp:
 *                 type: string
 *                 description: The OTP code to verify
 *                 example: "123456"
 *               phone:
 *                 type: string
 *                 description: The phone number associated with the OTP
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: OTP verification successful
 *       404:
 *         description: OTP not found or expired
 *       500:
 *         description: Internal server error
 */
// VERIFY OTP
router.post('/verifyotp',verifyotp)


/**
 * @swagger
 * /user/sendEmailOtp:
 *   post:
 *     summary: Send OTP to a user's email
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '##/models/userModel'
 *             properties:
 *               email:
 *                 type: string
 *                 description: The phone number to send the OTP to
 *                 example: "test@gmail.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Bad request. Invalid phone number.
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// SEND EMAIL OTP
router.post('/sendEmailOtp',sendEmailOtp)



/**
 * @swagger
 * /user/verifyEmailOtp:
 *   post:
 *     summary: Verify email OTP 
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '##/models/userModel'
 *             properties:
 *               email:
 *                 type: string
 *                 description: The phone number to send the OTP to
 *                 example: "test@gmail.com"
 *               otp:
 *                 type: string
 *                 description: Enter OTP sent to your email
 *                 example: 'HY723H'
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Bad request. Invalid phone number.
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// VERIFY EMAIL OTP
router.post('/verifyEmailOtp',verifyEmailOtp)

module.exports = router