using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class AvatarFixedToArray : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Avatar_AppUserId",
                table: "Avatar");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "Users");

            migrationBuilder.CreateIndex(
                name: "IX_Avatar_AppUserId",
                table: "Avatar",
                column: "AppUserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Avatar_AppUserId",
                table: "Avatar");

            migrationBuilder.AddColumn<int>(
                name: "PublicId",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Avatar_AppUserId",
                table: "Avatar",
                column: "AppUserId",
                unique: true);
        }
    }
}
