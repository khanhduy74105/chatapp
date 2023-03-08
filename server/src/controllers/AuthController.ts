const conn = require("../db/dcCoonect")
import jwt from 'jsonwebtoken'
import bcrypts from 'bcryptjs'
const AuthController = {
    signup: async (req, res) => {
        const { email, password } = req.body
        const createdAt = new Date()
        const updatedAt = new Date()
        const salt = await bcrypts.genSalt(10);
        const hashed = await bcrypts.hash(password, salt);
        if (email && password) {
            conn.query("select username from user where username = ?", [email], (err, result) => {
                if (err) {
                    res.json({ success: false, message: "failded" })
                } else {
                    if (result.length > 0) {
                        res.json({ success: false, message: "Tai khoan da ton tai" })
                    } else {
                        conn.query("INSERT INTO `user` (`username`, `password`, `createdAt`, `updatedAt`) VALUES (?,?,?,?)", [email, hashed, createdAt, updatedAt], (err) => {
                            if (err) {
                                res.json({ success: false, message: "them that bai" })
                            } else {
                                res.json({ success: true, message: "dang ky thanh cong" })
                            }
                        })
                    }
                }
            })
        } else {
            res.json({ success: false, message: "Nhap tai khoan va mat khau" })
        }

    },
    login: async (req, res) => {
        const { email, password } = req.body
        if (email && password) {
            conn.query("select * from user where username = ? limit 1", [email], async (err, result) => {
                if (err) {
                    res.json({ success: false, message: "failded" })
                } else {
                    const valid = await bcrypts.compare(password, result[0].password)
                    if (valid) {
                        const accessToken = jwt.sign({
                            username: result[0].username,
                            avatar: result[0].avatar,
                            id: result[0].id
                        }, 'key'
                        )
                        res.json({
                            data: {
                                username: result[0].username,
                                avatar: result[0].avatar,
                                id: result[0].id
                            }, success: true, accessToken
                        })
                    } else {
                        res.json({ message: "mat khau sai", success: false })
                    }
                }
            })
        } else {
            res.json({ success: false, message: "Nhap tai khoan va mat khau" })
        }

    },

    addfriend: async (req, res) => {
        try {
            const { user_id_2 } = req.body
            if (user_id_2 && req.user.id) {
                conn.query("select * from friend where user_id_1 = ? and user_id_2 = ?", [req.user.id, user_id_2], async (err, result) => {
                    if (err) {
                        res.json({
                            success: false,
                            message: "Co loi xay ra select"
                        })
                    } else {
                        if (result.length > 0) {
                            res.json({
                                success: true,
                                message: "Da la ban be"
                            })
                        } else {
                            conn.query("insert into friend(user_id_1, user_id_2)  values( ?, ?)", [req.user.id, user_id_2], async (error, result) => {
                                if (error) {
                                    res.json({
                                        success: true,
                                        message: "Co loi xay ra insert"
                                    })
                                } else {
                                    res.json({
                                        friend: result,
                                        message: "da vao add friend"
                                    })
                                }

                            })
                        }
                    }
                })
            } else {
                res.json({
                    message: "khong du data",
                    user: req.user.id,
                })
            }
        } catch (error) {
            res.json({
                error
            })
        }

    },
    getFriends: async (req, res) => {
        try {
            const { id } = req.user
            if (id) {
                conn.query(
                    "SELECT id, username, avatar FROM user JOIN friend on user.id = friend.user_id_2 where friend.user_id_1 = ? UNION SELECT id, username, avatar FROM user JOIN friend on user.id = friend.user_id_1 where friend.user_id_2 = ?",
                    [id, id],
                    async (err, result) => {
                        if (err) {
                            res.json({
                                success: false,
                                message: "Error in getFriends"
                            })
                        } else {
                            res.json({
                                success: true,
                                items: result
                            })
                        }
                    })
            } else {
                res.json({
                    success: false,
                    message: "khong co user"
                })
            }
        } catch (error) {
            res.json({
                success: false,
                message: "Error in getFriends catch"
            })
        }
    },
    getConversation: async (req, res) => {
        try {
            const { id } = req.user
            const { user2 } = req.params

            conn.query("SELECT `conversation_id`, `conversation_name`, `conversation_type` FROM `conversation` WHERE user_1 = ? AND user_2 =? or user_1 = ? AND user_2 =? limit 1", [id, user2, user2, id], async (err, result) => {
                if (err) {
                    res.json({
                        success: false,
                        message: "Error in gatConversation"
                    })
                } else {
                    if (result.length > 0) {
                        res.json({
                            success: true,
                            data: result[0]
                        })
                    } else {
                        conn.query("INSERT INTO `conversation`( `creator_id`, `user_1`, `user_2`) VALUES (?,?,?)", [id, id, user2], async (err, result) => {
                            if (err) {
                                res.json({
                                    success: false,
                                    message: "Error in gatConversation insert"
                                })
                            } else {
                                conn.query("SELECT `conversation_id`, `conversation_name`, `conversation_type` FROM `conversation` WHERE user_1 = ? AND user_2 =? or user_1 = ? AND user_2 =? limit 1", [id, user2, user2, id], async (err, result) => {
                                    if (err) {
                                        res.json({
                                            success: false,
                                            message: "Error in gatConversation"
                                        })
                                    } else {
                                        res.json({
                                            success: true,
                                            message: "create conversation !!!",
                                            data: result[0]
                                        })
                                    }
                                }
                                )

                            }
                        })
                    }


                }
            })
        } catch (error) {
            res.json({
                success: false,
                message: "Error in gatConversation catch"
            })
        }
    },
    insertMessage: async (req, res) => {
        try {
            const { id } = req.user
            const { conversation_id, message_content } = req.body
            if (id && conversation_id && message_content) {
                conn.query("INSERT INTO `message`(`conversation_id`, `sender_id`, `message_content`, `created_at`) VALUES(?,?,?,?)",
                    [conversation_id, id, message_content, new Date()], async (err) => {
                        if (err) {
                            res.json({
                                success: false,
                                message: 'Loi o insert'
                            })
                        } else {
                            res.json({
                                success: true,
                                message: 'gui thanh cong'
                            })
                        }
                    })
            } else {
                res.json({
                    success: false,
                    message: 'Thieu du lieu'
                })
            }
        } catch (error) {
            res.json({
                success: false,
                message: 'loi o catch insertMessage'
            })
        }
    },
    getMessages: async (req, res) => {
        try {
            const { id } = req.user
            const { conversation_id } = req.params
            if (id && conversation_id) {
                conn.query("SELECT * FROM `message` WHERE conversation_id = ?",
                    [conversation_id], async (err, result) => {
                        if (err) {
                            res.json({
                                success: false,
                                message: 'Loi o select'
                            })
                        } else {
                            res.json({
                                success: true,
                                data: result
                            })
                        }
                    })
            } else {
                res.json({
                    success: false,
                    message: 'Thieu du lieu'
                })
            }
        } catch (error) {
            res.json({
                success: false,
                message: 'loi o catch getMeassges'
            })
        }
    },
    getPeople: async (req, res) => {
        try {
            const { id } = req.user
            if (id) {
                conn.query("SELECT * FROM user WHERE user.id not in (SELECT friend.user_id_1 FROM friend WHERE friend.user_id_2 = ? UNION SELECT friend.user_id_2 FROM friend WHERE friend.user_id_1 = ?) and id not in (?)", [id, id, id],
                    async (err, result) => {
                        if (err) {
                            res.json({
                                success: false,
                                message: "Error in getPeople"
                            })
                        } else {
                            res.json({
                                success: true,
                                items: result
                            })
                        }
                    })
            } else {
                res.json({
                    success: false,
                    message: "khong co user"
                })
            }
        } catch (error) {
            res.json({
                success: false,
                message: "Error in getPeople catch"
            })
        }
    }
}
export default AuthController