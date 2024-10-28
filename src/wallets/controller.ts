import { Body, Controller, Post, Route, Tags } from 'tsoa';
import { AssignResponse, IKMS } from '../interfaces';
import { solanaService } from '../services';

@Route('wallet')
@Tags('Wallet')
export class WalletController extends Controller {
  // POST /wallet/solana/assign
  @Post('solana/assign')
  public async assignSolana(@Body() requestBody: Pick<IKMS, 'uid'>): Promise<AssignResponse> {
    await solanaService.init();
    console.log('solana assign requestBody', requestBody);
    return solanaService.assignWallet(requestBody);
  }
}
