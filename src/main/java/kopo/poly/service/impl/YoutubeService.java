package kopo.poly.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;

@Service
public class YoutubeService {
    @Value("${youtube.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

    public String search(String query) {
        String url = UriComponentsBuilder.fromHttpUrl(YOUTUBE_SEARCH_URL)
                .queryParam("key", apiKey)
                .queryParam("part", "snippet")
                .queryParam("type", "video")
                .queryParam("q", query)
                .queryParam("maxResults", 3) // 최대 결과 개수
                .encode(StandardCharsets.UTF_8)
                .toUriString();

        return restTemplate.getForObject(url, String.class);
    }
}
