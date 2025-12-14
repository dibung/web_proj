# Web1 Project

## 프로젝트 개요
Node.js + Express 기반 웹 프로젝트입니다.  
MySQL 데이터베이스와 연동되며, JWT 인증, Swagger 문서, Postman 컬렉션을 포함합니다.

주요 기능:
- 회원가입, 로그인(JWT)
- 책(Book) CRUD
- 주문(Order) CRUD, 상태 변경
- 리뷰, 댓글, 즐겨찾기, 좋아요 기능
- Swagger 기반 API 문서 제공
- Postman 컬렉션 제공

## Swagger
- 주소: `http://<JCloud주소>:3000/docs`
- 모든 API 명세 확인 가능

## API Root
- Root URL: `http://<JCloud주소>:3000`

## 설치 및 실행 방법
```bash
# 1. 패키지 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 서버가 3000 포트에서 실행됩니다
# Swagger UI는 http://localhost:3000/docs
