package kopo.poly.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * lombok은 코딩을 줄이기 위해 @어노테이션을 통한 자동 코드 완성기능임
 *
 * @Getter => getter 함수를 작성하지 않았지만, 자동 생성
 * @Setter => setter 함수를 작성하지 않았지만, 자동 생성
 */
@Getter
@Setter
public class CommentDTO {

    private long commentSeq;
    private long noticeSeq;
    private String userId;
    private String contents;
    private String regDt;
    private String userName;
    private long exp;
}

