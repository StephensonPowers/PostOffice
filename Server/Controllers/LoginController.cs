using Microsoft.AspNetCore.Mvc;
using PostOffice.Server.Models;
using System.Data;
using System.Data.SqlClient;

namespace PostOffice.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public LoginController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        [Route("Registration")]
        public IActionResult Registration(User user)
        {


            SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("PODB").ToString());

            var sql = $@"""
                INSERT INTO Users(
                    UserName,
                    Password,
                    Email)
                Values(
                    {user.Username},
                    {user.Password},
                    {user.Email})
                """;

            SqlCommand cmd = new SqlCommand(sql, conn);
            conn.Open();
            int i = cmd.ExecuteNonQuery();
            conn.Close();
            if (i > 0)
            {
                return RedirectToAction("Index", "Home");
            }
            else
            {
                return RedirectToAction("Index", "Login");
            }
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login(User user)
        {
            SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("PODB").ToString());

            var sql = $@"""
                SELECT * FROM Users
                WHERE Email = {user.Email} AND Password = {user.Password}
                """;
            SqlDataAdapter adapter = new SqlDataAdapter(sql, conn);
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            if (dt.Rows.Count > 0)
            {
                return RedirectToAction("Index", "Home");
            }
            else
            {
                return RedirectToAction("Index", "Login");
            }
        }
    }
}
