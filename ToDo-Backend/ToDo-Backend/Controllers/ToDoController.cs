using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using ToDo_Backend.Models;
using System.Collections.Generic;
using System.Security.Cryptography;
using Org.BouncyCastle.Bcpg;
using ZstdSharp.Unsafe;

namespace ToDo_Backend.Controllers {
    [ApiController]
    [Route("api/[Controller]")]
    public class ToDoController : ControllerBase {
        private readonly string connectionString = "Server=localhost;Database=ToDoDb;User=root;Password=Ibuki0606#;";
        [HttpGet("get")]
        public IActionResult Get(string user_Id) {
            List<ListModel> lists = new List<ListModel>();
            using MySqlConnection connection = new MySqlConnection(connectionString);
            try {
                connection.Open();
                string getQuery = "SELECT * FROM ToDoList WHERE user_Id = @user_Id";
                using(MySqlCommand cmd = new MySqlCommand(getQuery, connection)) {
                    cmd.Parameters.AddWithValue("@user_Id", user_Id);
                    using MySqlDataReader reader = cmd.ExecuteReader();
                    while(reader.Read()) {
                        var list = new ListModel
                        {
                            Id = Convert.ToInt32(reader["Id"]),
                            Title = reader["Title"].ToString(),
                            Description = reader["Description"].ToString(),
                            DueDate = reader["DueDate"] != DBNull.Value ? (DateTime?)reader["DueDate"] : null,
                            user_Id = reader["user_Id"].ToString(),

                        };

                        lists.Add(list);
                    }

                    if(lists.Count == 0) {
                        return NotFound(new
                        {
                            message = "このユーザーのタスクは見つかりませんでした"
                        });
                    }
                };

                return Ok(lists);
            }
            catch(Exception ex) {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("add")]
        public IActionResult Post([FromBody] ListModel list, string user_Id) {
            using MySqlConnection connection = new MySqlConnection(connectionString);
            try {
                connection.Open();
                string postQuery = "INSERT INTO ToDoList(Title,Description,DueDate,user_Id)  VALUES(@Title,@Description,@DueDate,@user_Id)";
                using(MySqlCommand cmd = new MySqlCommand(postQuery, connection)) {
                    cmd.Parameters.AddWithValue("@Title", list.Title);
                    cmd.Parameters.AddWithValue("@Description", list.Description);
                    cmd.Parameters.AddWithValue("@user_Id", user_Id);
                    cmd.Parameters.AddWithValue("@DueDate", list.DueDate ?? (object)DBNull.Value);
                    cmd.ExecuteNonQuery();
                }

                return Ok(new
                {
                    message = "タスクが正常に追加されました"
                });

            }
            catch(Exception ex) {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("edit/{id}")]
        public IActionResult Edit([FromBody] ListModel list, int id, string user_Id) {
            using MySqlConnection connection = new MySqlConnection(connectionString);
            try {
                connection.Open();
                string editQuery = "UPDATE ToDoList SET Title = @Title, Description = @Description,user_Id=@user_Id, DueDate = @DueDate WHERE Id = @Id";
                using(MySqlCommand cmd = new MySqlCommand(editQuery, connection)) {
                    cmd.Parameters.AddWithValue("@Title", list.Title);
                    cmd.Parameters.AddWithValue("@Description", list.Description);
                    cmd.Parameters.AddWithValue("@DueDate", list.DueDate ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Id", id);
                    cmd.Parameters.AddWithValue("@user_Id", user_Id);
                    int rowsAffected = cmd.ExecuteNonQuery();
                    if(rowsAffected > 0) {
                        return Ok(new
                        {
                            message = "商品が更新されました"
                        });
                    }
                    else {
                        return NotFound(new
                        {
                            message = "商品が見つかりませんでした"
                        });
                    }
                };
            }
            catch(Exception ex) {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id, string user_Id) {
            using MySqlConnection connection = new MySqlConnection(connectionString);
            try {
                connection.Open();
                string deleteQuery = "DELETE FROM ToDoList WHERE Id = @Id AND user_Id = @user_Id";
                using(MySqlCommand cmd = new MySqlCommand(deleteQuery, connection)) {
                    cmd.Parameters.AddWithValue("@Id", id);
                    cmd.Parameters.AddWithValue("@user_Id", user_Id);
                    int rowsAffected = cmd.ExecuteNonQuery();

                    if(rowsAffected > 0) {
                        return Ok(new
                        {
                            message = "削除出来ました"
                        });
                    }
                    else {
                        return NotFound(new
                        {
                            message = "タスクが見つかりませんでした"
                        });
                    }
                }
            }
            catch(Exception ex) {
                return StatusCode(500, ex.Message);
            }
        }
    }
}

