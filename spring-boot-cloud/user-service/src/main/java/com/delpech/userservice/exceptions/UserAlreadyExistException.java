package com.delpech.userservice.exceptions;

public class UserAlreadyExistException extends Throwable {
    public UserAlreadyExistException(String s) {
        super(s);
    }
}
