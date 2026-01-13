package com.example.backend.service.aws;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    /**
     * S3에 저장된 이미지 객체의 public url을 반환
     * List 파일들이나 파일을 stream 으로 변환 후
     * map(this::uploadImage) : 각파일에 대해 uploadImage 메서드 호출
     * 검증된 모든 파일을 한번에 묶어서 다시 List 로 변환 후 반환
     */
    public List<String> upload(List<MultipartFile> files) {
        // 각 파일을 업로드하고 url을 리스트로 반환
        log.info("s3 upload");
        return files.stream()
                .map(this::uploadImage)
                .toList();
    }

    /**
     * validateFile메서드를 호출하여 유효성 검증 후
     * uploadImageToS3메서드에 데이터를 반환하여 S3에 파일 업로드,
     * public url을 받아 서비스 로직에 반환
     */
    private String uploadImage(MultipartFile file) {
        log.info("s3 uploadImage" + file.getOriginalFilename());
        validateFile(file.getOriginalFilename()); // 파일 유효성 검증
        return uploadImageToS3(file); // 이미지를 S3에 업로드하고, 저장된 파일의 public url을 서비스 로직에 반환
    }

    /**
     * 파일 유효성 검증
     * 존재 유무 확장자 존재 유무 검증후
     * 파일 이름에서 확장자 추출 후 소문자로 변환
     * allowedExtentionList 로 업로드 가능한 파일 확장자 생성
     * 업로드한 파일에서 확장자만 추출후 소문자로 변경한 (fileExtension) 확장자 를 비교 후 검증
     */
    private void validateFile(String filename) {

        // 파일 존재 유무 검증
        if (filename == null || filename.isEmpty()) {
            log.error("s3 validateFile 존재하지 않음");
            throw new IllegalArgumentException("파일 이 존재하지 않습니다");
        }

        // 확장자 존재 유무 검증
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            log.error("s3 validateFile 확장자가 존재하지 않음");
            throw new IllegalArgumentException("파일 확장자가 존재하지 않습니다");
        }

        // 1. 파일 이름에서 확장자 추출
        String fileExtension = "";
        int lastDot = filename.lastIndexOf('.');
        if (lastDot > 0) {
            // 파일 이름의 마지막 마침표 이후 문자열을 추출하고 소문자로 변환 비교 일관성 확보
            fileExtension = filename.substring(lastDot + 1).toLowerCase();
        }

        // 2. 허용된 확장자 리스트 정의
        List<String> allowedExtentionList = Arrays.asList("jpg", "jpeg", "png", "gif");

        // 3. 검증
        // 파일 확장자가 비어있거나 (확장자가 없는 경우), 허용 목록에 없는 경우 에러 발생
        if (fileExtension.isEmpty() || !allowedExtentionList.contains(fileExtension)) {
            log.error("s3 validateFile 허용하지 않는 파일 확장자. 추출된 확장자: {}", fileExtension);
            throw new IllegalArgumentException("허용 하지 않는 파일 확장자 입니다");
        }
        // 통과
    }

    /**
     * 직접적으로 S3에 업로드
     * 파일을 S3 버킷에 저장하는 AWS SDK 호출이 일어나는 부분
     * 중복 방지를 피한원본 파일 이름과 10자리 랜덤 문자열 생성후 조합: (s3FileName)
     *
     */
    private String uploadImageToS3(MultipartFile file) {
        log.info("s3 uploadImageToS3 (Optimizing...)");
        String originalFilename = file.getOriginalFilename();
        String extension = Objects.requireNonNull(originalFilename).substring(originalFilename.lastIndexOf(".") + 1);
        String s3FileName = UUID.randomUUID().toString().substring(0, 10) + "_" + originalFilename;

        // 압축된 데이터를 담을 출력 스트림
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
             InputStream inputStream = file.getInputStream()) {

            // --- 1. 원본 최적화 (1920px, JPG, 압축 80%) ---
            Thumbnails.of(inputStream)
                    .size(1920, 1920) // 최대 가로세로 1920px (비율 유지)
                    .outputFormat("jpg") // 무조건 jpg 로 변환
                    .outputQuality(0.8) // 화질 80% (용량 대폭 감소, 육안 차이 미미)
                    .toOutputStream(outputStream);

            // 2. 압축된 데이터를 바이트 배열로 변환
            byte[] compressedBytes = outputStream.toByteArray();

            // 3. S3 업로드를 위한 요청 객체 생성 (압축된 사이즈로 세팅)
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(s3FileName)
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .contentType("image/" + extension)
                    .contentLength((long) compressedBytes.length) // 중요: 압축된 파일 크기
                    .build();

            // 4. S3에 업로드 (ByteArrayInputStream 사용)
            s3Client.putObject(putObjectRequest,
                    RequestBody.fromInputStream(new ByteArrayInputStream(compressedBytes), compressedBytes.length));

            log.info("S3 Upload Success: {} (Reduced: {} -> {} bytes)",
                    s3FileName, file.getSize(), compressedBytes.length);

        } catch (Exception exception) {
            log.error("S3 파일 업로드/압축 중 오류 발생: {}", exception.getMessage());
            throw new IllegalArgumentException("S3 파일 업로드 중 오류 발생", exception);
        }

        return s3Client.utilities().getUrl(url -> url.bucket(bucket).key(s3FileName)).toString();
    }
}

