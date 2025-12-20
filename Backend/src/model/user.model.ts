import { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt'

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	role: 'ADMIN' | 'TEACHER' | 'STUDENT';
	isActive: boolean;
	comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser> ({
	name: {
		type: String,
		required: true,
		min: 3,
		max: 20,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		index: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
		min: 4,
		max: 8,
		select: false, // this will make password not return in response whenever request made
	},
	role: {
		type: String,
		enum: ['ADMIN', 'TEACHER', 'STUDENT']
		default: 'STUDENT',
	},
	isActive: {
		type: boolean,
		default: true,
	}
},
{
	timestamps: true,
}
)

// methods run before save to convert password into hashed password
UserSchema.pre('save', async function (next) {
	// checks password is modified or not
	if(!this.isModified('password')) return next();
	// generate hashed password to save
	this.password = await bcrypt.hash(this.password, 10);
	next();
})

// compare password
UserSchema.methods.comparePassword = async function ( candidate: string ): Promise<boolean> {
	return bcrypt.compare(candidate, this.password);
}

// remove password field from json response
UserSchema.set('toJSON', {
	transform: (_doc, ret) => {
		delete ret.password;
		return ret;
	}
})


// generate usermodel for export
const userModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default userModel;

