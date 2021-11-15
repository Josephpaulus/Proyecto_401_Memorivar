const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECt * FROM t_curso', (err, users) => {
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
/*         conn.query('INSERT INTO t_curso set ?', [data], (err, usuario) => {
            console.log(usuario);
            console.log(data);
            res.redirect('/');
        }); */

        conn.query(`INSERT INTO t_curso (curso_estado_publico, curso_nombre, curso_descripcion) VALUES (1, '${data.Nombre}', '${data.Descripcion}')`);
        //console.log(data.Nombre);
        //console.log(data.Descripcion);
        res.redirect('/');

        /* conn.query(`INSERT INTO t_curso VALUES (4, 4, 4, 'Japones', 'Taka')`); */
    })
};


controller.delete = (req, res) => {
    //console.log(req.params.curso_id); Muestra el ID del curso a eliminar
    const curso_id = req.params
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM t_curso WHERE curso_id = ?', [])
    })
}

module.exports = controller;