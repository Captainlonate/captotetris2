import mongoose from 'mongoose'

// ==============================================

export interface I_MDBUser extends mongoose.Document {
  username: string
  password: string
}

export const Schema_User = new mongoose.Schema<I_MDBUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // createdAt & updatedAt
    timestamps: true,
  }
)

// ==============================================

export interface I_MDBChat extends mongoose.Document {
  message: string
  author: string
}

export const Schema_Chat = new mongoose.Schema<I_MDBChat>(
  {
    message: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  {
    // createdAt & updatedAt
    timestamps: true,
  }
)
