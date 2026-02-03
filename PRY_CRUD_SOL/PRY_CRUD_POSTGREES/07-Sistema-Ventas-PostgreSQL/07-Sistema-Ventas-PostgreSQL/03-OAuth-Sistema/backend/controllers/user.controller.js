const { UserService } = require("../services/user.service");
class UserController {
    static getProfile(req, res) {
        const userId = req.user.sub;
        const perfil = UserService.getProfile(userId);
        if (!perfil) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json({
            ok: true,
            Data: perfil,
        });
    }
}

module.exports = UserController;