using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimsPrincipleExtensions
    {
        public static string GetUsername(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        public static string GetRelicname(this ClaimsPrincipal relic)
        {
            return relic.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }
    }
}