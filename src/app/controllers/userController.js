const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECt * FROM t_curso where curso_estado_publico = 1', (err, users) => {
            if (err) {
                res.json(err);
            }
            //console.log(users); Muestra los datos obtenidos de la tabla
            res.render('users', {
                data: users
            });
        });
    });
};

controller.add = (req, res) => {
    //console.log(req.body); //Muestra los datos que recibe de la página
    //res.send('works'); Si funciona muestra "works"
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query(`INSERT INTO t_curso (curso_estado_publico, curso_nombre, curso_descripcion) 
        VALUES (1, '${data.Nombre}', '${data.Descripcion}')`);
        //console.log(data.Nombre);
        //console.log(data.Descripcion);
        res.redirect('/');
    })
};

controller.edit = (req, res) => {
    const curso_id = req.params.curso_id;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM t_curso WHERE curso_id = ?', [curso_id], (err, curso) => {
            res.render('curso_edit', {
                data: curso[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const curso_id = req.params.curso_id;
    const newCurso = req.body;
    req.getConnection((err, conn) => {
        conn.query(`UPDATE t_curso set curso_nombre = '${newCurso.Nombre}', 
        curso_descripcion = '${newCurso.Descripcion}' WHERE curso_id = ?`, [curso_id], (err, rows) => {
            res.redirect('/');
        });
    });
};

controller.delete = (req, res) => {
    //console.log(req.params.curso_id); Muestra el ID del curso a eliminar
    const curso_id = req.params.curso_id;
    req.getConnection((err, conn) => {
        conn.query('UPDATE t_curso SET curso_estado_publico = 0 where curso_id = ?', [curso_id], (err, rows) => {
            res.redirect('/');
        })
    })
}

module.exports = controller;