using System.Text.RegularExpressions;

namespace ProductCatalog.API.Services
{
    public interface ISanitizationService
    {
        string SanitizeInput(string? input);
        decimal SanitizePrice(decimal price);
    }

    public class SanitizationService : ISanitizationService
    {
        public string SanitizeInput(string? input)
        {
            if (string.IsNullOrEmpty(input))
                return string.Empty;

            // Remove HTML tags and scripts
            input = Regex.Replace(input, @"<[^>]*>", string.Empty);

            // Remove potentially dangerous characters but allow normal punctuation
            input = Regex.Replace(input, @"[<>;""']", string.Empty);

            // Trim and normalize whitespace
            return input.Trim().Replace("\n", " ").Replace("\r", " ");
        }

        public decimal SanitizePrice(decimal price)
        {
            // Validate price range
            if (price < 0.01m)
                throw new ArgumentException("Price must be greater than 0.01");

            if (price > 1000000m)
                throw new ArgumentException("Price cannot exceed 1,000,000");

            // Round to 2 decimal places (banker's rounding)
            return Math.Round(price, 2, MidpointRounding.AwayFromZero);
        }
    }
}