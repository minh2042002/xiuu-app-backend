import User from "../models/User.js";

export const getAllUser = async (req, res) => {
    await User.find({}, '-password -refreshToken')
        .then((users) => {
            if (!users) {
                return res.status(404).json({ message: "Not found users!" });
            }

            return res.status(200).json({ users });
        })
        .catch((err) => console.log(err));
};

export const updateUserLogin = async (req, res) => {
    const {name, pwd} = req.body;

    await User.findByIdAndUpdate(req.user.id, {name: name, password: pwd})
        .then((existUser) => {
            if (!existUser) {
                return res.status(404).json({ message: "User is not exists!" });
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ message: "Internal server error" });
        });

    await User.findById(req.user.id, '-password -refreshToken')
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: "User is not exists!" });
            }

            return res.status(200).json({ user });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ message: "Internal server error" });
        });
};

export const updateUser = async (req, res) => {
    const userId = req.params.id;
    const updateField = req.body;

    await User.findByIdAndUpdate(userId, updateField)
        .then((existUser) => {
            if (!existUser) {
                return res.status(404).json({ message: "User is not exists!" });
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ message: "Internal server error" });
        });

    await User.findById(userId, '-password -refreshToken')
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: "User is not exists!" });
            }

            return res.status(200).json({ user });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ message: "Internal server error" });
        });
};

export const deleteUserById = async (req, res) => {
    const userId = req.params.id;
    await User.findById(userId)
        .then((deleteUser) => {
            if (!deleteUser) {
                return res.status(404).json({ message: "User (is not exists!" });
            }
            if ((deleteUser._id === req.user.id) || (deleteUser.admin === true)) {
                return res.status(405).json({ message: "Not allowed delete admin!"})
            } 
        })
        .catch((err) => console.log(err));

    try {
        await User.deleteOne(userId);

        return res
        .status(200)
        .json({ message: `Delete user: ${delUser._id}` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error"});
    }

        
};
