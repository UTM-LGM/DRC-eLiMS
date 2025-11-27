using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace elims
{
    public class EmailServices
    {
        public static async Task<bool> SendEmailAsync(string recipient, string subject, string message)
        {
            var emailMessage = new MimeMessage();
            var builder = new BodyBuilder();

            emailMessage.From.Add(new MailboxAddress("Elims", "Elims@lgm.gov.my"));
            emailMessage.To.Add(new MailboxAddress("", recipient));
            emailMessage.Subject = subject;
            builder.HtmlBody = message;
            emailMessage.Body = builder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                client.LocalDomain = "lgm.gov.my";
                //await client.ConnectAsync("10.4.137.18", 25, SecureSocketOptions.None).ConfigureAwait(false);
                await client.ConnectAsync("postmaster2.mygovuc.gov.my", 25, SecureSocketOptions.None).ConfigureAwait(false);
                await client.SendAsync(emailMessage).ConfigureAwait(false);
                await client.DisconnectAsync(true).ConfigureAwait(false);
            }
            return true;
        }
    }
}
