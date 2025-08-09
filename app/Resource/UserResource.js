
module.exports = (user) => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        imagePath: user.imagePath || "",
        IsVerify: user.IsVerify
    }
};