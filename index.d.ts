declare class SMS {
  constructor(url: string, options: SMSOptions);

  send(phoneNumber: string, message: string): Promise<SMSSendResponse>;

  sent(id: string): Promise<boolean>;
}

interface SMSOptions {
  line?: number;
  user?: string;
  pass?: string;
  sendUrl?: string;
  statusUrl?: string;
  statusRetries?: number;
  statusWait?: boolean;
  timeout?: number;
}

interface SMSSendResponse {
  id: string;
  raw: string;
  status?: 'send' | 'error';
  message?: string;
}

export default SMS;
