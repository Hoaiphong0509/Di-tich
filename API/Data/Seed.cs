using System.Text;
using System.Security.Cryptography;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using API.Extensions;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedData(DataContext context)
        {
            if (await context.Users.AnyAsync()) return;

            var userSeedData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
            // var relicSeedData = await System.IO.File.ReadAllTextAsync("Data/RelicSeedData.json");

            var users = JsonSerializer.Deserialize<List<AppUser>>(userSeedData);
            // var relics = JsonSerializer.Deserialize<List<Relic>>(relicSeedData);

            foreach (var user in users)
            {
                using var hmac = new HMACSHA512();

                user.UserName = user.UserName.ToLower();
                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));
                user.PasswordSalt = hmac.Key;

                var relics = user.Relics;
                foreach(var relic in relics)
                {
                    relic.NameUnmark = relic.Name.ConvertToUnSign();
                }

                context.Users.Add(user);
            }

            await context.SaveChangesAsync();
        }
    }
}