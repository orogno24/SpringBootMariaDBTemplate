package kopo.poly.service;

import kopo.poly.dto.UserInfoDTO;

public interface IUserInfoService {



    // 아이디 중복 체크
    UserInfoDTO getUserIdExists(UserInfoDTO pDTO) throws Exception;

    // 이메일 주소 중복 체크 및 인증 값
    UserInfoDTO getEmailExists(UserInfoDTO pDTO) throws Exception;

    UserInfoDTO getEmailSend(UserInfoDTO pDTO) throws Exception;

    // 회원 가입하기(회원정보 등록하기)
    int insertUserInfo(UserInfoDTO pDTO) throws Exception;

    // 로그인을 위해 아이디와 비밀번호가 일치하는지 확인하기
    UserInfoDTO getLogin(UserInfoDTO pDTO) throws Exception;

    UserInfoDTO searchUserIdOrPasswordProc(UserInfoDTO pDTO) throws Exception;

    // 아이디, 비밀번호 찾기에 활용
    UserInfoDTO getUserId(UserInfoDTO pDTO) throws Exception;

    // 비밀번호 재설정
    void newPasswordProc(UserInfoDTO pDTO) throws Exception;

    UserInfoDTO checkUserId(UserInfoDTO pDTO) throws Exception;

    // 닉네임 중복체크
    UserInfoDTO getUserNameExists(UserInfoDTO pDTO) throws Exception;

    // 닉네임 변경하기
    void newUserNameProc(UserInfoDTO pDTO) throws Exception;

    // 등급 조회하기
    UserInfoDTO getGrade(UserInfoDTO pDTO) throws Exception;

    // 등급 삽입하기
    void updateGrade(UserInfoDTO pDTO) throws Exception;

    void updatePoint(UserInfoDTO pDTO) throws Exception;

    void updateExp(UserInfoDTO pDTO) throws Exception;

}
