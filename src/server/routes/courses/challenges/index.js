const challenges = (app, pool) => {
  // para hacer consultas secuenciales
  const query = function (sql, values) {
    // devolver una promesa
    return new Promise((resolve, reject) => {
      pool.getConnection(function (err, connection) {
        if (err) {
          reject(err);
          return;
        }

        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
          // finaliza la sesión
          connection.release();
        });
      });
    });
  };

  app.post('/courses/challenges/history', async (request, response) => {
    const req = request.body;
    const courseId = req.courseId;
    const userId = Number(req.userId);
    const history = [];

    await query(
      'SELECT challenge_id FROM challenges_users WHERE course_id = ? AND user_id = ? AND deleted = ?',
      [courseId, userId, 0]
    ).then(async (result) => {
      const challenges = JSON.parse(JSON.stringify(result));

      for (const challenge of challenges) {
        const challengeId = challenge.challenge_id;

        data = {
          id: challengeId,
        };

        await query(
          'SELECT winner_id, creation_time, status FROM challenges WHERE id = ?',
          challengeId
        ).then((result) => {
          let winner = result[0].winner_id;

          if (winner !== null) {
            winner = winner === userId;
          }

          data = {
            ...data,
            winner: winner,
            creationTime: result[0].creation_time,
            status: result[0].status,
          };
        });

        await query(
          ` SELECT 
              cu.user_id,
              cu.opponent,
              u.user, 
              u.image 
            FROM challenges_users cu 
              JOIN users u 
                ON u.id = cu.user_id 
            WHERE cu.challenge_id = ?`,
          challengeId
        ).then((result) => {
          const users = JSON.parse(JSON.stringify(result));

          let opponentIndex = users.findIndex((user) => user.opponent === 1);

          data.originalOpponent = {
            id: users[opponentIndex].user_id,
          };

          if (users[opponentIndex].user_id === userId) {
            opponentIndex = users.findIndex((user) => user.opponent === 0);
          }

          data.opponent = {
            id: users[opponentIndex].user_id,
            user: users[opponentIndex].user,
            image: users[opponentIndex].image,
          };
        });

        history.push(data);
      }
    });

    response.json(history);
  });

  app.post('/courses/challenges/details', async (request, response) => {
    const req = request.body;
    const challengeId = req.challengeId;
    const courseId = req.courseId;
    const userId = Number(req.userId);

    const data = {
      winner: null,
      status: -1,
      results: [],
    };

    await query('SELECT winner_id, status FROM challenges WHERE id = ?', [
      challengeId,
    ]).then((result) => {
      let winner = result[0].winner_id;

      if (winner !== null) {
        winner = winner === req.userId;
      }

      data.winner = winner;
      data.status = result[0].status;
    });

    await query(
      `
      SELECT
        csd.id,
        u.id AS user_id,
        u.user,
        (SELECT opponent FROM challenges_users WHERE challenge_id = cd.challenge_id AND course_id = cd.course_id AND user_id = cd.user_id) AS opponent,
        u.image,
        uc.points,
        csd.concept,
        csd.answer,
        correct_answer
      FROM
        challenges_data cd
          JOIN
        users u ON u.id = cd.user_id
          JOIN
        courses_data csd ON csd.id = cd.concept_id
          JOIN
        users_courses uc ON uc.user_id = cd.user_id AND uc.course_id = cd.course_id
      WHERE
        cd.challenge_id = ? AND cd.course_id = ?
      `,
      [challengeId, courseId]
    ).then(async (result) => {
      const challenges = JSON.parse(JSON.stringify(result));

      let store = true;

      for (const challenge of challenges) {
        let challenge_data = {
          id: challenge.id,
          concept: challenge.concept,
          answer: challenge.answer,
        };

        const index = data.results.findIndex(
          (result) => result.id === challenge.id
        );

        if (index !== -1) {
          challenge_data = data.results[index];
          store = false;
        }

        const result = {
          user: challenge.user,
          image: challenge.image,
          points: challenge.points,
          correctAnswer: challenge.correct_answer,
        };

        if (challenge.opponent === 0) {
          if (challenge.user_id !== userId) {
            challenge_data.opponent = result;
          } else {
            challenge_data.challenger = result;
          }
        } else {
          if (challenge.user_id === userId) {
            challenge_data.challenger = result;
          } else {
            challenge_data.opponent = result;
          }
        }

        if (store) {
          data.results.push(challenge_data);
        }
      }
    });

    response.json(data);
  });

  app.post('/courses/challenges/create', async (request, response) => {
    const req = request.body;
    const userId = Number(req.userId);
    const opponentId = Number(req.opponentId);
    const courseId = req.courseId;
    const creationTime = req.creationTime;
    const concepts = req.concepts;

    let challengeId = null;

    await query(
      `
      INSERT INTO challenges (course_id, creation_time)
      VALUES (?, ?)
      `,
      [courseId, creationTime]
    ).then((result) => {
      challengeId = result.insertId;
    });

    await query(
      `
      INSERT INTO challenges_users (user_id, course_id, challenge_id, opponent, status)
      VALUES (?, ?, ?, ?, ?)
      `,
      [userId, courseId, challengeId, 0, 1]
    );

    await query(
      `
      INSERT INTO challenges_users (user_id, course_id, challenge_id, opponent, status)
      VALUES (?, ?, ?, ?, ?)
      `,
      [opponentId, courseId, challengeId, 1, 0]
    );

    for (const user of [userId, opponentId]) {
      for (const concept of concepts) {
        await query(
          `
          INSERT INTO challenges_data (challenge_id, course_id, user_id, concept_id, correct_answer)
          VALUES (?, ?, ?, ?, ?)
          `,
          [challengeId, courseId, user, concept.id, 0]
        );
      }
    }

    response.send(challengeId.toString());
  });

  app.post('/courses/challenges/answer', async (request, response) => {
    const req = request.body;
    const challengeId = req.challengeId;
    const courseId = req.courseId;
    const userId = Number(req.userId);
    const conceptId = req.conceptId;
    const correctAnswer = req.correctAnswer;

    await query(
      `
      UPDATE challenges_data
      SET correct_answer = ?
      WHERE challenge_id = ? AND course_id = ? AND user_id = ? AND concept_id = ?
      `,
      [correctAnswer, challengeId, courseId, userId, conceptId]
    );

    response.end();
  });

  app.post('/courses/challenges/status', async (request, response) => {
    const req = request.body;
    const challengeId = req.challengeId;
    const courseId = req.courseId;
    const userId = Number(req.userId);
    const status = req.status;

    await query(
      `
      UPDATE challenges_users
      SET status = ?
      WHERE challenge_id = ? AND course_id = ? AND user_id = ?
      `,
      [status, challengeId, courseId, userId]
    );

    response.end();
  });

  app.post('/courses/challenges/concepts', async (request, response) => {
    const req = request.body;
    const challengeId = req.challengeId;
    const courseId = req.courseId;
    const userId = Number(req.userId);

    pool.query(
      `
      SELECT 
          csd.id, csd.concept, csd.answer
      FROM
          challenges_data cd
              JOIN
          courses_data csd ON csd.id = cd.concept_id
      WHERE
          cd.challenge_id = ?
              AND cd.course_id = ?
              AND cd.user_id = ?
      `,
      [challengeId, courseId, userId],
      (error, result) => {
        if (error) throw error;

        response.json(result);
      }
    );
  });

  app.post('/courses/challenges/finish', async (request, response) => {
    const req = request.body;
    const challengeId = req.challengeId;
    let courseId = null;

    await query(
      'SELECT course_id FROM challenges WHERE id = ?',
      challengeId
    ).then((result) => {
      courseId = result[0].course_id;
    });

    const users = [];

    await query(
      `
      SELECT * 
      FROM challenges_data
      WHERE challenge_id = ? AND course_id = ?
      `,
      [challengeId, courseId]
    ).then((result) => {
      const data = JSON.parse(JSON.stringify(result));

      for (const concepts of data) {
        const index = users.findIndex((user) => user.id === concepts.user_id);

        if (index === -1) {
          users.push({
            id: concepts.user_id,
            correctAnswer: concepts.correct_answer,
          });
        } else {
          users[index].correctAnswer += concepts.correct_answer;
        }
      }
    });

    let winnerId = null;

    if (users[0].correctAnswer > users[1].correctAnswer) {
      winnerId = users[0].id;
    } else if (users[0].correctAnswer < users[1].correctAnswer) {
      winnerId = users[1].id;
    }

    await query(
      `
      UPDATE challenges
      SET status = ?, winner_id = ?
      WHERE id = ? AND course_id = ?
      `,
      [1, winnerId, challengeId, courseId]
    );

    response.end();
  });

  app.post('/courses/challenges/history/clear', async (request, response) => {
    const req = request.body;
    const courseId = req.courseId;
    const userId = Number(req.userId);

    await query(
      `
      UPDATE challenges_users
      SET deleted = ?
      WHERE course_id = ? AND user_id = ?
      `,
      [1, courseId, userId]
    );

    response.end();
  });
};

// Export the challenge routes
module.exports = challenges;
