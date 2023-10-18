// import mongoose from 'mongoose';
// import { Request } from 'express';
// import { UserI } from '../shared/types/modelTypes';
//
// const User = mongoose.model(
//   'User',
//   new mongoose.Schema<UserI>(
//     {
//       email: {
//         type: String,
//         unique: true,
//         required: true,
//       },
//       password: {
//         type: String,
//         required: true,
//       },
//       userInfo: {
//         firstName: {
//           type: String,
//           required: true,
//         },
//         lastName: {
//           type: String,
//           required: true,
//         },
//         aboutMe: {
//           type: String,
//         },
//         interest: {
//           type: [String],
//         },
//         defaultLocation: {
//           type: String,
//         },
//         avatar: {
//           secure_url: {
//             type: String,
//             default:
//               'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2629&q=80',
//           },
//           public_id: {
//             type: String,
//           },
//         },
//         reviews: [
//           {
//             firstName: {
//               type: String,
//             },
//             content: {
//               type: String,
//             },
//             rating: {
//               type: Number,
//             },
//             creationDate: {
//               type: Date,
//               default: Date.now,
//             },
//           },
//         ],
//       },
//     },
//     {
//       statics: {
//         async register(req: Request) {
//           const { email, password, firstName, lastName } = req.body;
//           const user = new this({
//             email,
//             password,
//             userInfo: {
//               firstName,
//               lastName,
//             },
//           });
//
//           try {
//             await user.save();
//           } catch (error) {
//             console.log(error);
//           }
//         },
//       },
//     },
//   ),
// );
//
// export default User;
