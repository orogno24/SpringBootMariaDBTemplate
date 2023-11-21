package kopo.poly.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChartDTO {
    private long PoseSeq;

    private String userId;

    private String date;

    private String week;

    private String normal;

    private String abnormal;

    private int totalNormal;

    private int totalAbnormal;

    private String totalTime;

    private String weekday;

    private int totalNormalTime;

    private int totalAbnormalTime;

    private String checkHour;

    private String checkMinute;

    private String checkFive;

    private String checkTen;

    @Override
    public String toString() {
        return "ChartDTO{" +
                "checkTen='" + checkTen + '\'' +
                ", totalNormalTime=" + totalNormalTime +
                ", totalAbnormalTime=" + totalAbnormalTime +
                '}';
    }
}