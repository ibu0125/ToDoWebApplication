using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using ToDo_Backend.Models;
using System.Collections.Generic;
using System.Security.Cryptography;
using Org.BouncyCastle.Bcpg;
using ZstdSharp.Unsafe;
using Org.BouncyCastle.Tls;
using Azure.Core;

namespace ToDo_Backend.Controllers {
    [ApiController]
    [Route("api/[Controller]")]
    public class UserController : ControllerBase {
        private readonly string connectionString = "Server=localhost;Database=ToDoDb;User=root;Password=Ibuki0606#;";

        [HttpPost("login")]
        public IActionResult Login([FromBody] InformationModel information) {
            using MySqlConnection connection = new MySqlConnection(connectionString);
            try {
                connection.Open();
                string getQuery = "SELECT * FROM Information WHERE UserId = @UserId AND Password = @Password";
                using(MySqlCommand cmd = new MySqlCommand(getQuery, connection)) {
                    cmd.Parameters.AddWithValue("@UserId", information.UserId);
                    cmd.Parameters.AddWithValue("@Password", information.Password);

                    using(var reader = cmd.ExecuteReader()) {
                        if(reader.Read()) {
                            return Ok("ログインしました");
                        }
                        else {
                            return Unauthorized(new
                            {
                                message = "ユーザーネームかパスワードが間違っています"
                            });
                        }
                    }
                };
            }
            catch(Exception ex) {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("signUp")]
        public IActionResult SignUp([FromBody] InformationModel information) {
            using MySqlConnection connection = new MySqlConnection(connectionString);
            try {
                connection.Open();
                string insertQuery = "INSERT INTO Information(UserId,Password)  VALUES(@UserId,@Password)";
                using(MySqlCommand cmd = new MySqlCommand(insertQuery, connection)) {
                    cmd.Parameters.AddWithValue("@UserId", information.UserId);
                    cmd.Parameters.AddWithValue("@Password", information.Password);
                    cmd.ExecuteNonQuery();
                }

                return Ok(information);
            }
            catch(Exception ex) {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
