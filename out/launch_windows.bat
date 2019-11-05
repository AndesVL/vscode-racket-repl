@echo off
cls
cd %1
racket -i -f "%~dp0/enter.rkt" ""%1"" ""%2""


