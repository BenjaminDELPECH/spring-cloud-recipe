/*
export class BaseUrlInterceptor implements HttpInterceptor {
  private readonly BASE_URL = 'http://localhost:9069/api'
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const baseUrlReq = req.clone({
      url: `${this.BASE_URL}${req.url}`
    })
    return next.handle(baseUrlReq);
  }

}
*/
