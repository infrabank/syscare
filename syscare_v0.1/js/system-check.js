// System Check Assessment JavaScript

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        initializeAssessment();
    });
}

function initializeAssessment() {
    const form = document.getElementById('systemAssessment');
    const inputs = document.querySelectorAll('.assessment-input, input[type="checkbox"]');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const submitBtn = document.getElementById('submitBtn');
    const resultsModal = document.getElementById('resultsModal');

    const questionNames = Array.from(new Set(Array.from(inputs)
        .map(input => input.name)
        .filter(Boolean)));
    const totalQuestions = questionNames.length;
    const completionThreshold = Math.max(1, Math.ceil(totalQuestions * 0.75));

    if (progressText) {
        progressText.textContent = `0 / ${totalQuestions} 완료`;
    }
    
    // Track progress
    function updateProgress() {
        const filledInputs = Array.from(inputs).filter(input => {
            if (input.type === 'checkbox') {
                return document.querySelectorAll(`input[name="${input.name}"]:checked`).length > 0;
            }
            return input.value !== '';
        });
        
        // Remove duplicates for checkbox groups
        const uniqueNames = [...new Set(filledInputs.map(input => input.name))];
        const progress = totalQuestions === 0 ? 0 : (uniqueNames.length / totalQuestions) * 100;

        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        if (progressText) {
            progressText.textContent = `${uniqueNames.length} / ${totalQuestions} 완료`;
        }

        // Enable submit button when all required fields are filled
        if (submitBtn) {
            submitBtn.disabled = uniqueNames.length < completionThreshold; // At least 75% questions answered
        }
    }
    
    // Add event listeners
    inputs.forEach(input => {
        input.addEventListener('change', updateProgress);
        input.addEventListener('input', updateProgress);
    });

    // Initialize progress state on load
    updateProgress();
    
    // Handle checkbox exclusivity for "none" option in issues
    const issueCheckboxes = document.querySelectorAll('input[name="issues"]');
    issueCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.value === 'none' && this.checked) {
                issueCheckboxes.forEach(cb => {
                    if (cb.value !== 'none') cb.checked = false;
                });
            } else if (this.value !== 'none' && this.checked) {
                document.querySelector('input[name="issues"][value="none"]').checked = false;
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        processAssessment();
    });

    // Results modal: focus management + close handling
    if (resultsModal) {
        resultsModal.addEventListener('close', function() {
            document.body.classList.remove('overflow-hidden');
            if (submitBtn) {
                submitBtn.focus();
            }
        });

        // Click on the backdrop (the dialog element itself, outside its content box) closes it
        resultsModal.addEventListener('click', function(e) {
            if (e.target === resultsModal) {
                closeModal();
            }
        });

        const modalCloseBtn = document.getElementById('modalCloseBtn');
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }
        const modalCloseBtnBottom = document.getElementById('modalCloseBtnBottom');
        if (modalCloseBtnBottom) {
            modalCloseBtnBottom.addEventListener('click', closeModal);
        }
    }

    // Phone number formatting
    const phoneInput = document.querySelector('input[type="tel"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9]/g, '');
            let formatted = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            e.target.value = formatted;
        });
    }
}

function processAssessment() {
    const formData = new FormData(document.getElementById('systemAssessment'));
    const data = {};

    // Process form data
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }

    // Calculate score and generate results
    const results = calculateScore(data);

    // GA4 이벤트 전송 - 전산 상태 확인 완료
    if (typeof gtag === 'function') {
        gtag('event', 'assessment_completed', {
            'event_category': 'engagement',
            'event_label': 'system_check',
            'risk_level': results.riskLevel,
            'score': results.score,
            'has_contact_info': !!(data.phone && data.email)
        });
    }

    displayResults(results, data);
}

function calculateScore(data) {
    let score = 0;
    let maxScore = 100;
    let recommendations = [];
    let riskLevel = 'low';
    
    // Scoring algorithm
    
    // 1. Company size (5 points max)
    if (data.employees) {
        switch(data.employees) {
            case '1-10': score += 5; break;
            case '11-50': score += 4; break;
            case '51-100': score += 3; break;
            case '100+': score += 2; break;
        }
    }
    
    // 2. Operating systems (10 points max)
    if (data.os) {
        const osArray = Array.isArray(data.os) ? data.os : [data.os];
        if (osArray.includes('windows') && osArray.includes('linux')) {
            score += 10;
        } else if (osArray.length >= 2) {
            score += 8;
        } else if (osArray.length === 1) {
            score += 6;
        }
    } else {
        recommendations.push('운영체제 정보를 확인하고 최신 버전으로 업데이트하세요.');
    }
    
    // 3. Server infrastructure (15 points max)
    if (data.server) {
        switch(data.server) {
            case 'none': score += 8; break;
            case '1': score += 10; break;
            case '2-5': score += 13; break;
            case '6-10': score += 15; break;
            case '10+': score += 12; break;
        }
    } else {
        recommendations.push('서버 인프라를 점검하고 적정 수준을 유지하세요.');
    }
    
    // 4. Network setup (10 points max)
    if (data.network) {
        switch(data.network) {
            case 'basic': score += 5; break;
            case 'managed': score += 8; break;
            case 'enterprise': score += 10; break;
            case 'unsure': score += 3; 
                recommendations.push('네트워크 구성을 전문가에게 점검받아보세요.');
                break;
        }
    }
    
    // 5. Backup strategy (20 points max) - Critical
    if (data.backup) {
        switch(data.backup) {
            case 'none': 
                score += 0; 
                riskLevel = 'high';
                recommendations.push('⚠️ 즉시 백업 시스템을 구축하세요. 데이터 손실 위험이 매우 높습니다.');
                break;
            case 'manual': 
                score += 8;
                riskLevel = 'medium';
                recommendations.push('정기적인 자동 백업 시스템으로 업그레이드하세요.');
                break;
            case 'weekly': score += 15; break;
            case 'daily': score += 18; break;
            case 'realtime': score += 20; break;
        }
    } else {
        recommendations.push('백업 전략을 수립하고 실행하세요.');
    }
    
    // 6. Security solutions (15 points max)
    if (data.security) {
        switch(data.security) {
            case 'none': 
                score += 0;
                riskLevel = 'high';
                recommendations.push('⚠️ 기본적인 보안 솔루션을 즉시 도입하세요.');
                break;
            case 'basic': score += 8; break;
            case 'firewall': score += 12; break;
            case 'enterprise': score += 15; break;
        }
    }
    
    // 7. Update management (10 points max)
    if (data.updates) {
        switch(data.updates) {
            case 'none': 
                score += 0;
                recommendations.push('정기적인 시스템 업데이트가 필요합니다.');
                break;
            case 'manual': score += 6; break;
            case 'scheduled': score += 9; break;
            case 'automated': score += 10; break;
        }
    }
    
    // 8. Current issues (deduct points for problems)
    if (data.issues) {
        const issuesArray = Array.isArray(data.issues) ? data.issues : [data.issues];
        if (!issuesArray.includes('none')) {
            score -= issuesArray.length * 3;
            if (issuesArray.includes('security') || issuesArray.includes('data')) {
                riskLevel = 'high';
            }
            recommendations.push('현재 겪고 있는 문제들을 우선적으로 해결하세요.');
        } else {
            score += 10; // Bonus for no issues
        }
    }
    
    // 9. IT management (5 points max)
    if (data.manager) {
        switch(data.manager) {
            case 'none': 
                score += 0;
                recommendations.push('전산 관리 담당자를 지정하거나 외부 전문가의 도움을 받으세요.');
                break;
            case 'part-time': score += 3; break;
            case 'full-time': score += 5; break;
            case 'external': score += 4; break;
        }
    }
    
    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score));
    
    // Determine risk level based on score
    if (score >= 80) riskLevel = 'low';
    else if (score >= 60) riskLevel = 'medium';
    else riskLevel = 'high';
    
    return {
        score: Math.round(score),
        riskLevel: riskLevel,
        recommendations: recommendations
    };
}

function displayResults(results, data) {
    const modal = document.getElementById('resultsModal');
    const scoreElement = document.getElementById('totalScore');
    const contentElement = document.getElementById('resultsContent');
    
    // Update score
    scoreElement.textContent = results.score;
    
    // Create score chart
    createScoreChart(results.score);
    
    // Generate content
    let riskColor, riskText, riskDescription;
    switch(results.riskLevel) {
        case 'low':
            riskColor = 'text-green-600';
            riskText = '양호';
            riskDescription = '전산 시스템이 안정적으로 관리되고 있습니다.';
            break;
        case 'medium':
            riskColor = 'text-yellow-600';
            riskText = '주의';
            riskDescription = '일부 개선이 필요한 부분이 있습니다.';
            break;
        case 'high':
            riskColor = 'text-red-600';
            riskText = '위험';
            riskDescription = '즉시 개선이 필요한 부분들이 있습니다.';
            break;
    }

    const alertTone = results.riskLevel === 'high'
        ? { box: 'bg-red-50 border-red-200', heading: 'text-red-800', list: 'text-red-700' }
        : { box: 'bg-yellow-50 border-yellow-200', heading: 'text-yellow-800', list: 'text-yellow-700' };
    const alertIcon = '<svg aria-hidden="true" focusable="false" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="inline-block align-[-0.125em] mr-2"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>';

    contentElement.innerHTML = `
        <div class="bg-gray-50 p-6 rounded-xl">
            <div class="text-center mb-6">
                <h3 class="text-2xl font-bold mb-2">위험도: <span class="${riskColor}">${riskText}</span></h3>
                <p class="text-gray-700">${riskDescription}</p>
            </div>
            
            ${results.score >= 80 ? `
                <div class="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <h4 class="font-semibold text-green-800 mb-2">
                        <svg aria-hidden="true" focusable="false" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="inline-block align-[-0.125em] mr-2"><path d="M9 12.75l2.25 2.25L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        우수한 전산 관리 상태
                    </h4>
                    <p class="text-green-700 text-sm">
                        현재 전산 시스템이 안정적으로 관리되고 있습니다. 
                        정기적인 점검을 통해 이 상태를 유지하시기 바랍니다.
                    </p>
                </div>
            ` : `
                <div class="${alertTone.box} border p-4 rounded-lg">
                    <h4 class="font-semibold ${alertTone.heading} mb-2">
                        ${alertIcon}
                        개선 권장 사항
                    </h4>
                    <ul class="${alertTone.list} text-sm space-y-1">
                        ${results.recommendations.map(rec => `<li>• ${rec}</li>`).join('')}
                    </ul>
                </div>
            `}
        </div>
        
        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white border p-6 rounded-xl">
                <h4 class="font-semibold mb-4 text-gray-900">
                    <svg aria-hidden="true" focusable="false" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="inline-block align-[-0.125em] text-yellow-500 mr-2"><path d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/></svg>
                    맞춤 개선 방안
                </h4>
                <div class="space-y-3 text-sm">
                    ${generateCustomRecommendations(data, results).map(rec => `
                        <div class="flex items-start">
                            <svg aria-hidden="true" focusable="false" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="inline-block align-[-0.125em] text-blue-500 mt-1 mr-2 text-xs"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                            <span class="text-gray-700">${rec}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="bg-white border p-6 rounded-xl">
                <h4 class="font-semibold mb-4 text-gray-900">
                    <svg aria-hidden="true" focusable="false" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="inline-block align-[-0.125em] text-green-500 mr-2"><path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-13.5-3l1.5 1.5 3-3.75"/></svg>
                    권장 실행 순서
                </h4>
                <div class="space-y-3 text-sm">
                    ${generatePriorityActions(results).map((action, index) => `
                        <div class="flex items-start">
                            <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mr-2 mt-0.5">${index + 1}</span>
                            <span class="text-gray-700">${action}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="bg-blue-50 p-6 rounded-xl">
            <h4 class="font-semibold mb-4 text-blue-900">
                <svg aria-hidden="true" focusable="false" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="inline-block align-[-0.125em] mr-2"><path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>
                SYSCARE 서비스 추천
            </h4>
            <p class="text-blue-800 mb-4">
                귀하의 진단 결과를 바탕으로 다음 서비스를 추천드립니다:
            </p>
            <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-white p-4 rounded-lg text-center">
                    <svg aria-hidden="true" focusable="false" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="inline-block align-[-0.125em] text-blue-600 text-2xl mb-2"><path d="M12 2.25c-3.14 1.938-6.75 3.036-6.75 3.036v6.402c0 5.058 3.109 8.492 6.75 9.812 3.641-1.32 6.75-4.754 6.75-9.812V5.286S15.14 4.188 12 2.25z"/></svg>
                    <h5 class="font-semibold text-gray-900 mb-1">예방 점검</h5>
                    <p class="text-xs text-gray-600">정기적인 시스템 점검</p>
                </div>
                <div class="bg-white p-4 rounded-lg text-center">
                    <svg aria-hidden="true" focusable="false" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="inline-block align-[-0.125em] text-green-600 text-2xl mb-2"><path d="M16.023 9.348h4.992v-4.992M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"/></svg>
                    <h5 class="font-semibold text-gray-900 mb-1">백업 복구검증</h5>
                    <p class="text-xs text-gray-600">백업 점검과 복구 테스트</p>
                </div>
                <div class="bg-white p-4 rounded-lg text-center">
                    <svg aria-hidden="true" focusable="false" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="inline-block align-[-0.125em] text-orange-600 text-2xl mb-2"><path d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085"/></svg>
                    <h5 class="font-semibold text-gray-900 mb-1">유지보수</h5>
                    <p class="text-xs text-gray-600">전문 기술 지원</p>
                </div>
            </div>
        </div>
    `;

    // Show modal
    openModal(modal);
}

function openModal(modal) {
    if (!modal) return;
    document.body.classList.add('overflow-hidden');
    if (typeof modal.showModal === 'function') {
        modal.showModal();
    } else {
        // Fallback for browsers without <dialog> support
        modal.setAttribute('open', '');
    }
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if (modalCloseBtn) {
        modalCloseBtn.focus();
    }
}

function closeModal() {
    const modal = document.getElementById('resultsModal');
    if (!modal) return;
    if (typeof modal.close === 'function' && modal.open) {
        modal.close(); // fires the 'close' event, which handles focus + scroll-lock cleanup
    } else {
        modal.removeAttribute('open');
        document.body.classList.remove('overflow-hidden');
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.focus();
        }
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        calculateScore
    };
}

let scoreChartInstance = null;

function createScoreChart(score) {
    const canvas = document.getElementById('scoreChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (scoreChartInstance) {
        scoreChartInstance.destroy();
    }

    scoreChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [score, 100 - score],
                backgroundColor: [
                    score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444',
                    '#E5E7EB'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
}

function generateCustomRecommendations(data, results) {
    const recommendations = [];
    
    if (!data.backup || data.backup === 'none' || data.backup === 'manual') {
        recommendations.push('자동화된 백업 시스템 구축');
    }
    
    if (!data.security || data.security === 'none' || data.security === 'basic') {
        recommendations.push('통합 보안 솔루션 도입');
    }
    
    if (!data.manager || data.manager === 'none') {
        recommendations.push('전산 관리 담당자 지정 또는 아웃소싱');
    }
    
    if (data.issues && Array.isArray(data.issues) && data.issues.includes('slow')) {
        recommendations.push('시스템 성능 최적화');
    }
    
    if (data.network === 'basic' || data.network === 'unsure') {
        recommendations.push('네트워크 인프라 업그레이드');
    }
    
    recommendations.push('정기적인 시스템 점검 계획 수립');
    
    return recommendations.slice(0, 5); // 최대 5개 추천사항
}

function generatePriorityActions(results) {
    const actions = [];
    
    if (results.riskLevel === 'high') {
        actions.push('즉시 백업 시스템 구축');
        actions.push('기본 보안 솔루션 설치');
        actions.push('긴급 시스템 점검 실시');
    } else if (results.riskLevel === 'medium') {
        actions.push('백업 정책 개선');
        actions.push('보안 수준 강화');
        actions.push('정기 점검 계획 수립');
    } else {
        actions.push('현재 수준 유지');
        actions.push('정기 점검 지속');
        actions.push('최신 기술 동향 파악');
    }
    
    actions.push('전문가 상담 받기');
    actions.push('장기 발전 계획 수립');
    
    return actions.slice(0, 5);
}
