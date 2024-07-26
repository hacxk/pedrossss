import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth/facebook')
export class FacebookController {
  @Get()
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req) {}

  @Get('callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req, @Res() res) {
    // Handle the Facebook auth callback
    const user = req.user;
    // Here you can generate a JWT or set a session
    res.send(this.generateLoginHtml(user));
  }

  private generateLoginHtml(user: any) {
    return `
      <html>
        <body>
          <h1>Welcome ${user.firstName}!</h1>
          <script>
            window.opener.postMessage({ type: 'FACEBOOK_LOGIN_SUCCESS', user: ${JSON.stringify(user)} }, '*');
            window.close();
          </script>
        </body>
      </html>
    `;
  }
}
