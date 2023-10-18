import { TestBed } from '@angular/core/testing';

import { NewWebSocketService } from './new-web-socket.service';

describe('NewWebSocketService', () => {
  let service: NewWebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewWebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
