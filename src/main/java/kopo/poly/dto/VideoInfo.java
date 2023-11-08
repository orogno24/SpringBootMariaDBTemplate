package kopo.poly.dto;

public class VideoInfo {
    private String videoId;
    private String title;

    public VideoInfo(String videoId, String title) {
        this.videoId = videoId;
        this.title = title;
    }

    // Standard getters and setters

    public String getVideoId() {
        return videoId;
    }

    public void setVideoId(String videoId) {
        this.videoId = videoId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
