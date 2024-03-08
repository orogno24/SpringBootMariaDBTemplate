package kopo.poly.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class UserInfoDTO {
    private String userId;
    private String userSeq;
    private String password;
    private String email;
    private String userName;
    private String regId;
    private String regDt;
    private String chgId;
    private String chgDt;
    private String grade;

    // 회원가입시, 중복가입을 방지하기 위해 사용할 변수
    // DB를 조회해서 회원이 존재하면 Y값을 반환함
    // DB 테이블에 존재하지 않는 가상의 컬럼(ALIAS)
    private String existsYn;
    private String point;
    private String exp;

    // 이메일 중복체크를 위한 인증번호
    private int authNumber;
    private int mailNumber;

}
